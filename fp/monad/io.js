// IO.js
const daggy = require('daggy');
const { curryN } = require('ramda');

// IO :: (a -> b)
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

IO.prototype['fantasy-land/chain'] = IO.prototype.chain = function(f) {
  return IO.of(this.map(f).unsafePerformIO().unsafePerformIO())
}

IO['fantasy-land/of']= IO.of = function (x) {
  return IO(() => x);
}
// fantasy-land/ap :: Apply f => f a ~> f (a -> b) -> f b
IO.prototype['fantasy-land/ap'] = IO.prototype.ap = function(that) {
  const b = that.unsafePerformIO();
  return IO(()=> b(this.unsafePerformIO()));
}

// traverse :: Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
IO.prototype['fantasy-land/traverse'] = IO.prototype.traverse = function(T, f) {
  return f(this.unsafePerformIO()).map(IO.of)
}

// fantasy-land/reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
IO.prototype['fantasy-land/reduce'] = IO.prototype.reduce = function(f, acc) {
  return f(acc, this.unsafePerformIO())
}



module.exports = IO;

