const {RoseTree} = require('./fp/monad');
const {pipe, map, chain, ap, curry} = require('ramda');

const lift2 = (f, a, b) => b.ap(a.map(f));
const append = x => xs => [x, ...xs];
const traverse = (T, xs) => xs.reduce((acc, x) => lift2(append, T.of(x), acc), T.of([]));
// const convert = traverse(RoseTree, [1, 2, 3]);
// 
// console.log(convert, '1111111111')
// const t = RoseTree.of();
const D = [1, 2, 3];
const c = RoseTree.of(1);
const v = traverse(RoseTree, D);
const a = RoseTree.of(1);
const b = new RoseTree(x=> x.node ? x.node + 110 : x + 10, [ RoseTree.of(x => x + 1000) ]);
const g = new RoseTree(c, [a]).ap(b)//.ap(d);//.map(x=> x.node + 10);
const m = c.chain(x => new RoseTree(x, [RoseTree.of(2)]))//.chain(x => new RoseTree(x + 3, [RoseTree.of(100)]));
// console.log(m);
const f = [1,2,3,4].reduce((acc, x)=> acc.chain(a => new RoseTree(x, [RoseTree.of(1)])), RoseTree.of(1))
// console.log(g, f, m);
const a1 = RoseTree.of(1);
const a2= RoseTree.of(2);
const a3= RoseTree.of(3);
const cc = a1.concat(a2.concat(a3));
console.log(cc);
//.ap(new RoseTree(RoseTree.of(x=> x +1), [a]));
// chain will merge
// console.log(c, '<------00000000', v);
// console.log(v)
// const gg = new RoseTree(1, [new RoseTree(2, [new RoseTree(3, [])], [])])
// console.log(gg)