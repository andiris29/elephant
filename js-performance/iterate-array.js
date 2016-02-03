/**
 * Mac book pro
 * 	2 GHz Intel Core i7
 * Chrome 48.0.2564.97
 * 
 * i--: 1151.708ms
 * i++: 1389.196ms
 * for in: 953.872ms
 * forEach: 17.140ms
 * forEachIndex: 233.047ms
 */

var array = [];
for (var i = 1000 * 1000 - 1; i >=0; i--) {
	array.push('x');
}
console.time('i--');
for (var i = array.length - 1; i >=0; i--) {
	array[i];
}
console.timeEnd('i--');

console.time('i++');
for (var i = 0; i < array.length; i++) {
	array[i];
}
console.timeEnd('i++');

console.time('for in');
for (var i in array) {
	array[i];
}
console.timeEnd('for in');

console.time('forEach');
array.forEach(function(element, i) {
	element;
});
console.timeEnd('forEach');

console.time('forEachIndex');
array.forEach(function(element, i) {
	array[i];
});
console.timeEnd('forEachIndex');