const {RoseTree} = require('./fp/monad');
const daggy = require('daggy');
const lift2 = f => a => b => b.ap(a.map(f));
const append = x => xs => [x, ...xs];
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(append, T.of(x),  acc), T.of([]));


const tree = new RoseTree(1, [RoseTree.of(2), new RoseTree(3, [RoseTree.of(4)])]);
const a = new RoseTree('a', [RoseTree.of('a1'), new RoseTree('c', [RoseTree.of('c1')])]);
const ab = new RoseTree('ab', [ new RoseTree('ab1', [RoseTree.of('ab2')]) ]);
const b = RoseTree.of(21);
const fm = RoseTree.of(2);

// console.log(tree.map(x=> x.node || x));
// const bb = a.ap(new RoseTree(x=> x, [RoseTree.of(x  => x + 3), RoseTree.of(x  => x + 4)]))
// console.log(bb);

// hagamos el lift nuestro adorado anscensor
const c = lift2(x => y => `${x} plus  ${y}`)(a)(ab);

const n = c.reduce((acc, x)=> [...acc, x], []);

console.log(n);

// const example = new RoseTree( 1, [
//   new RoseTree(2, [RoseTree.of(9), new RoseTree(3, [
//     new RoseTree(4, [])
//   ])]),
  
// ]);
// const example = new RoseTree(1, [new RoseTree(2, [new RoseTree(3, [RoseTree.of(4)]), new RoseTree(5, [RoseTree.of(12)])])]);


// console.log(n, '1111111111', reduce(example));

