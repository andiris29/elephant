/**
 * Mac book pro
 * 	2 GHz Intel Core i7
 * Chrome 48.0.2564.97
 * 
 * i--: 1336.570ms
 * i++: 1450.970ms
 * for in: 1.338ms
 * forEach: 221.056ms
 * forEachIndex: 208.468ms
 */

var array = new Array(1000 * 1000);

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