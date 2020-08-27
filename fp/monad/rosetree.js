// Haskell 
// data RoseRoseTree a = RoseRoseTree a [RoseRoseTree a]
function RoseTree(node, forest) {
  this.node = node;
  this.forest = forest; 
}
// of :: Applicative f => f a ~> a -> f a
RoseTree.of = function(x) {
  return new RoseTree(x, []);
}

// ap :: Apply f => f a ~> f (a -> b) -> f b
RoseTree.prototype.ap = function(b) {
  const {node, forest} = this;
  const {node: f, forest: fs} = b;
  return new RoseTree(f(node), [].concat(
    forest ? forest.map(x => x.map(f)) : [], 
    fs ? fs.map(m => m instanceof RoseTree ? this.ap(m) : RoseTree.of(m)) : []
  ));
}
// map :: Functor f => f a ~> (a -> b) -> f b
RoseTree.prototype.map = function(f) {
  return new RoseTree(f(this.node), this.forest.map(x=> x.map(f)));
}


// chain :: Cahin m => m a ~> (a -> m b)-> m b
RoseTree.prototype.chain = function(f) {
  const { node: x, forest: xs } = f(this.node);
  return new RoseTree(x, [].concat(xs, this.forest.map(x => x.chain(f))));
}

// concat :: Semogroup a => a ~> a -> a
RoseTree.prototype.concat = function(b) {
  return new RoseTree(this.node, [].concat(this.forest, b))
}


// reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
RoseTree.prototype.reduce = function (f, acc) {
  return this.forest.reduce((acc, rt) => rt.reduce(f, acc), f(acc, this.node))
}

module.exports = RoseTree;
