const {RoseTree} = require('./fp/monad');
const daggy = require('daggy');
const lift2 = f => a => b => b.ap(a.map(f));
const append = x => xs => [x, ...xs];
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(append, T.of(x),  acc), T.of([]));


const tree = new RoseTree(1, [RoseTree.of(2), new RoseTree(3, [RoseTree.of(4)])]);
const a = new RoseTree('a', [RoseTree.of('a1')]);
const ab = new RoseTree('ab', [ new RoseTree('ab1', [RoseTree.of('ab2')]) ]);
const b = RoseTree.of(21);
const fm = RoseTree.of(2);

// console.log(tree.map(x=> x.node || x));
// const bb = a.ap(new RoseTree(x=> x, [RoseTree.of(x  => x + 3), RoseTree.of(x  => x + 4)]))
// console.log(bb);

// hagamos el lift nuestro adorado anscensor
const c = lift2(x => y => `${x} + ${y}`)(a)(ab);
console.log(c);

const Identity = daggy.tagged('Identity', ['x'])

// map :: Identity a ~> (a -> b)
//                   -> Identity b
Identity.prototype.map = function (f) {
  return new Identity(f(this.x))
}

// ap :: Identity a ~> Identity (a -> b)
//                  -> Identity b
Identity.prototype.ap = function (b) {
  return new Identity(b.x(this.x))
}

// Identity(5)
const t = lift2(x => y => x + y, Identity(2)
     , Identity(3))

// console.log(t);


// const example = new RoseTree( 1, [
//   new RoseTree(2, [RoseTree.of(9), new RoseTree(3, [
//     new RoseTree(4, [])
//   ])]),
  
// ]);
// const example = new RoseTree(1, [new RoseTree(2, [new RoseTree(3, [RoseTree.of(4)]), new RoseTree(5, [RoseTree.of(12)])])]);

// const reduce = xs => {
//   const red = (acc, x) => x.forest.reduce(red, [...acc, x.node]);

//   return xs.forest.reduce(red, [xs.node]);
// } 
// const n = example.reduce((acc, x)=> [...acc, x], []);
// console.log(n, '1111111111', reduce(example));

