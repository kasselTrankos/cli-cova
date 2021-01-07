// IO.js
const daggy = require('daggy');

const IO = daggy.tagged('IO', ['unsafePerformIO']);

IO.prototype['fantasy-land/map'] = IO.prototype.map = function(f) {
  return IO(()=>f(this.unsafePerformIO()));
}

IO.prototype.filter = function(f) {
  return IO(()=> this.unsafePerformIO().filter(f));
}

IO.prototype.equals = function(a) {
  return this.unsafePerformIO() === a;
}



IO.of = function(x) {
  return IO(()=> x)
}

IO.prototype.chain = function(f) {
  return IO.of(this.map(f).unsafePerformIO().unsafePerformIO())
}

IO.of = function (x) {
  return IO(() => x);
}
// fantasy-land/ap :: Apply f => f a ~> f (a -> b) -> f b
IO.prototype.ap = function(that) {
  const b = that.unsafePerformIO();
  return IO(()=> b(this.unsafePerformIO()));
}

module.exports = IO;

