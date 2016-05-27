var Train = function() {
    var Train = function(directions, num, scale, stations, direction) {
    	this.directions = $.extend([], directions);
        this.direction = direction;
    	this.stations = $.extend([], stations);
    	this.scale = scale;
    	this.pos = {
    		x : this.stations[0].pos.x * scale,
    		y : this.stations[0].pos.y * scale
    	};
    	this.stations.shift();
    	this.num = num;
    	this.calculateTime = Date.now();
    	this.dis = 0;
    	this.disToNextStation = this.directions[0].dis;
    	//this.dis is the distance from last station
    };

    Train.prototype.moveInSpeed = function(speed) {
        if(this.crashedStations && this.crashedStations.indexOf(this.stations[0].id) > -1) {
            this.stop = true;
            return;
        }
        var time = Date.now();
        if(this.stop) {
            this.calculateTime = time;
            return;
        }
    	if(time < this.calculateTime) {
    		//this means the train is now stop in a station and havn't start yet
    		return;
    	}
    	//the postion of the last calculate time
    	var moveTime = time - this.calculateTime;
    	var moveDis = speed * moveTime;
    	if(moveDis <= this.disToNextStation) {
    		//still in rail and havn't arrived at next station
    		this.calculateTime = time;
    		this.dis += moveDis;
    		this.calculateTime = time;
    		this.disToNextStation = this.directions[0].dis - this.dis;
    		if(this.directions[0].x == 0) {
    			//cover the k === infinity situation
    			this.pos.y += this.directions[0].i.iy * moveDis;
    		} else {
    			var k = this.directions[0].k;
    			var t = Math.sqrt(1 + k * k);
	    		this.pos.x += this.directions[0].i.ix * moveDis / t;
	    		this.pos.y += this.directions[0].i.iy * k * moveDis / t;
    		}
    	} else {
    		//the train has arrived in a station, need change direction and stop for a while
    		//set the scan frequence many quicklier than stop time in station so that we don't need to cover the situation that
    		//the train has arrived and left the station in one scan gap
    		this.arriveAtStation();
    	}
    };

    Train.prototype.setEmergencyStation = function(station) {
        this.emergencyStation = $.extend({}, station);
    }

    Train.prototype.arriveAtStation = function() {
    	this.directions.shift();
    	if(this.directions.length === 0) {
    		this.arrive();
            return;
    	} else {
    		this.pos = {
    			x : this.stations[0].pos.x * this.scale,
    			y : this.stations[0].pos.y * this.scale
    		};
    		this.disToNextStation = this.directions[0].dis;
    	}
        this.rightNow = this.stations[0].id;
        if(this.emergencyStation && (this.rightNow === this.emergencyStation.id)) {
            this.stopCrash();
            return;
        }
        if(this.emergencyStation && (this.crashedStations && (this.crashedStations.indexOf(this.stations[1].id) >= 0))) {
            this.stopCrash();
            return;
        }
        this.stations.shift();
    	this.calculateTime += 1000;
    	this.dis = 0;
    };

    Train.prototype.stopCrash = function() {
        this.stop = true;
        this.stopStation = this.rightNow;
    }

    Train.prototype.setCrashedStation = function(stations) {
        this.crashedStations = stations;
    }

    Train.prototype.arrive = function() {
    	//arrive at the end station
    	this.arrived = true;
    }

	return Train;
}();