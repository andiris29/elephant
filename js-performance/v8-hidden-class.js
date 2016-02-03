// https://www.youtube.com/watch?v=UJPdhx5zTaw
// http://v8-io12.appspot.com/
/**
 * Mac book pro
 * 	2 GHz Intel Core i7
 * Chrome 48.0.2564.97
 * 
 * base: 1217.777ms
 * nochange hidden class: 1451.346ms
 * change hidden class: 2194.618ms
 */
var Clazz = function(a, b) {
	this.a = a;
	this.b = b;
};

console.time('base');
for (var i = 1000 * 1000; i >=0; i--) {
	var clazz = new Clazz(1, 2);
}
console.timeEnd('base');

console.time('nochange hidden class');
for (var i = 1000 * 1000; i >=0; i--) {
	var clazz = new Clazz(1, 2);
	clazz['a'] = 3;
}
console.timeEnd('nochange hidden class');

console.time('change hidden class');
for (var i = 1000 * 1000; i >=0; i--) {
	var clazz = new Clazz(1, 2);
	clazz[i] = 3;
}
console.timeEnd('change hidden class');
