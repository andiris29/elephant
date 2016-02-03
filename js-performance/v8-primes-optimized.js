// https://www.youtube.com/watch?v=UJPdhx5zTaw
// http://v8-io12.appspot.com/
/**
 * Mac book pro
 * 	2 GHz Intel Core i7
 * Chrome 48.0.2564.97
 * 
 * main: 20.025ms
 */
function Primes() {
  this.prime_count = 0;
  this.primes = new Array(25000);
  this.getPrimeCount = function() { return this.prime_count; }
  this.getPrime = function(i) { return this.primes[i]; }
  this.addPrime = function(i) {
    this.primes[this.prime_count++] = i;
  }

  this.isPrimeDivisible = function(candidate) {
    // Out-of-Bounds Fix. 4331.462ms > 1404.101ms
    for (var i = 1; i < this.prime_count; ++i) {
      // Optimize Your Algorithm. 1404.101ms > 20.025ms
      var current_prime = this.primes[i];
      if (current_prime * current_prime > candidate) {
        return false;
      }
      if ((candidate % this.primes[i]) == 0) return true;
    }
    return false;
  }
};

function main() {
  p = new Primes();
  var c = 1;
  while (p.getPrimeCount() < 25000) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
    }
    c++;
  }
  console.log(p.getPrime(p.getPrimeCount()-1));
}

console.time('main');
main();
console.timeEnd('main');
