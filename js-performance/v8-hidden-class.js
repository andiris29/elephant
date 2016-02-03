// https://www.youtube.com/watch?v=UJPdhx5zTaw
// http://v8-io12.appspot.com/
/**
 * Mac book pro
 * 	2 GHz Intel Core i7
 * Chrome 48.0.2564.97
 * 
 * base: 1533.484ms
 * monomorphic: 1764.962ms
 * polymorphic: 2558.738ms
 */
var Clazz = function(a, b) {
	this[0] = a;
};

console.time('base');
for (var i = 1000 * 1000; i >=0; i--) {
	var clazz = new Clazz(1, 2);
}
console.timeEnd('base');

console.time('monomorphic');
for (var i = 1000 * 1000; i >=0; i--) {
	var clazz = new Clazz(1, 2);
	clazz[0] = 3;
}
console.timeEnd('monomorphic');

console.time('polymorphic');
for (var i = 1000 * 1000; i >=0; i--) {
	var clazz = new Clazz(1, 2);
	clazz[i] = 3;
}
console.timeEnd('polymorphic');
