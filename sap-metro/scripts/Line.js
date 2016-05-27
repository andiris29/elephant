var Line = function() {

	var Line = function(stations, name, scale, speed) {
		this.stations = $.extend([], stations);
		this.reverseStations = stations.reverse()
		this.name = name;
		this.scale = scale;
		this.trains = [];
		this.speed = speed;
		this.startStation = stations[0];
		this.endStation = stations[stations.length - 1];
		this.trainNum = 0;
		this.directions = buildDirection(this.stations, this.scale);
		this.reverseDirections = buildDirection(this.reverseStations, this.scale);
		this.launchTrain();
	};

	Line.prototype.launchTrain = function() {
		if(!(this.emergencySpeed && this.emergencySpeed === 0) && this.trains.length < 10) {
			var train = new Train(this.directions, this.trainNum, this.scale, this.stations, 0);
			this.trainNum ++;
			this.trains.push(train);
		}
		setTimeout(this.launchReverseTrain.bind(this), 3000);
	}

	Line.prototype.setEmergencySpeed = function(emergencySpeed) {
		this.emergencySpeed = emergencySpeed;
		return this;
	}

	Line.prototype.launchReverseTrain = function() {
		if(!(this.emergencySpeed && this.emergencySpeed === 0) && this.trains.length < 10) {
			var reverseTrain = new Train(this.reverseDirections, this.trainNum, this.scale, this.reverseStations, 1);
			this.trainNum ++;
			this.trains.push(reverseTrain);
		}
		setTimeout(this.launchTrain.bind(this), 3000);
	};

	Line.prototype.stopArrivedTrain = function(i) {
		this.trains[i] = null;
		this.trains.splice(i, 1);
	};

	Line.prototype.setCrashedStation = function(station, direction) {
		this.crashedStations = this.crashedStations || [];
		this.crashedStations[direction] = this.crashedStations[direction] || [];
		if(this.crashedStations[direction].indexOf(station) === -1) {
			this.crashedStations[direction].push(station);
		}
		for(var i = 0; i < this.trains.length; i ++) {
			this.trains[i].setCrashedStation(this.crashedStations[this.trains[i].direction]);
		}
	}

	Line.prototype.setEmergencyStation = function(emergencyStation, direction) {
		this.emergencyStation = emergencyStation;
		this.emergencyDirection = direction;
		return this;
	}

	Line.prototype.showTrains = function() {
		var num = this.trains.length;
		if(!num) {
			return;
		}
		for(var i = 0; i < this.trains.length; i ++) {
			if(this.trains[i].arrived) {
				this.stopArrivedTrain(i);
				i --;
			} else if(this.emergencyStation && this.emergencyDirection === this.trains[i].direction) {
				if(this.trains[i].stations.indexOf(this.emergencyStation) > -1) {
					if(this.trains[i].stop && this.trains[i].stopStation) {
						this.setCrashedStation(this.trains[i].stopStation, this.trains[i].direction);
					}
					this.trains[i].setEmergencyStation(this.emergencyStation);
					this.trains[i].moveInSpeed(this.emergencySpeed);
				} else {
					this.trains[i].moveInSpeed(this.speed);
				}
			} else {
				this.trains[i].moveInSpeed(this.speed);
			}
		}
		var pattern = this.startStation.id + 'trains';
		$('.' + pattern).remove();
		var trains = svg.selectAll('.' + pattern).data(this.trains, function(d) {return d.num;});

		trains.enter().append('circle').attr('cx', function (d) { return d.pos.x; })
          .attr('cy', function (d) { 
          	return d.pos.y; })
          .attr('r', 3).attr('fill', 
          	this.name).attr('class', pattern);
	};

    function buildDirection(stations, scale) {
    	var directions = [];
    	for(var i = 1; i < stations.length; i ++) {
    		var direction = {
    			x : scale * (stations[i].pos.x - stations[i - 1].pos.x),
    			y : scale * (stations[i].pos.y - stations[i - 1].pos.y)
    		};
    		var ix = direction.x / Math.abs(direction.x);
    		var iy = direction.y / Math.abs(direction.y);
    		if(isNaN(ix)) {
    			ix = 0;
    		}
    		if(isNaN(iy)) {
    			iy = 0;
    		}
    		direction.i = {
    			ix : ix,
    			iy : iy
    		};
    		direction.k = Math.abs(direction.y / direction.x);
    		direction.dis = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    		directions.push(direction);
    	}
    	return directions;
    }

	return Line;
}();