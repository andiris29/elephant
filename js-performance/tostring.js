/**
 * Mac book pro
 * 	2 GHz Intel Core i7
 * Chrome 48.0.2564.97
 * 
 * String(x): 1316.127ms
 * new String(x): 1348.150ms
 * x.toString(): 1105.322ms
 * x +'': 1084.559ms
 */
console.time('String(x)');
for (var i = 1000 * 1000; i >=0; i--) {
	String(i);
}
console.timeEnd('String(x)');

console.time('new String(x)');
for (var i = 1000 * 1000; i >=0; i--) {
	new String(i);
}
console.timeEnd('new String(x)');

console.time('x.toString()');
for (var i = 1000 * 1000; i >=0; i--) {
	i.toString();
}
console.timeEnd('x.toString()');

console.time('x +\'\'');
for (var i = 1000 * 1000; i >=0; i--) {
	i + '';
}
console.timeEnd('x +\'\'');
