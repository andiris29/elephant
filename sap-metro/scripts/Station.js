var Station = function() {
	var Station = function(id, name, pos, links) {
		this.id = id;
		this.name = name;
		this.pos = pos;
		this.links = links;
		this.generateNum();
	};

	// Station.prototype.increase = function(num) {
	// 	this.humanSum += num;
	// };

	// Station.prototype.decrease = function(num) {
	// 	this.humanSum -= num;
	// };

	Station.prototype.generateNum = function() {
		var value = this.value || this.links.length;
		var rangeMax = 200;
		var rangeMin = 180;
		var range = rangeMax - rangeMin;
		var num = Math.random() * range + rangeMin;
		num *= value;
		this.num = num;
	};

	Station.prototype.setValue = function(value) {
		this.value = value;
	};

	return Station;
}();