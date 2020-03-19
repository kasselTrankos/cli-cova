const {RoseTree} = require('./fp/monad');
const lift2 = (f, a, b) => b.ap(a.map(f));
const append = x => xs => [x, ...xs];
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(append, T.of(x),  acc), T.of([]));


const tree = new RoseTree(1, [RoseTree.of(2), new RoseTree(3, [RoseTree.of(4)])]);
const tree_1 = new RoseTree(1, [RoseTree.of(2), RoseTree.of(90)])

console.log(tree.map(x=> x.node || x));
const b = tree_1.ap(new RoseTree(x=> x +10, [RoseTree.of(x  => x +1290)]))
console.log(b);

// const example = new RoseTree( 1, [
//   new RoseTree(2, [RoseTree.of(9), new RoseTree(3, [
//     new RoseTree(4, [])
//   ])]),
  
// ]);
const example = new RoseTree(1, [new RoseTree(2, [new RoseTree(3, [RoseTree.of(4)]), new RoseTree(5, [RoseTree.of(12)])])]);

const reduce = xs => {
  const red = (acc, x) => x.forest.reduce(red, [...acc, x.node]);

  return xs.forest.reduce(red, [xs.node]);
} 
const n = example.reduce((acc, x)=> console.log(x, acc.concat) || [...acc, x], []);
console.log(n, '1111111111', reduce(example));

