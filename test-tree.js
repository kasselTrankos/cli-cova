const {Task, Maybe, RoseTree} = require('./fp/monad');
const {pipe, map, chain, ap, curry} = require('ramda');
const {readdir, statSync, existsSync} = require('fs');
const lift2 = f => a => b => b.ap(a.map(f));
const append = x => xs => [x, ...xs];
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(append, T.of(x),  acc), T.of([]));
const { Nothing, Just} = Maybe;


// :: Maybe String -> Task String String
const toTask = maybe => maybe.cata({
	Just: x => Task.of(x),
  Nothing: () => Task.of('')
});

const prop = key => obj => obj[key];
const getNode = prop('node');
const paralleliseTaskArray = xs => console.log(xs) || xs; //sequence(Task, xs.map(x=> x))

// :: RoseTree -> Task [] [RoseTree]
const read = dir => new Task((_, resolve)=> {
  readdir(dir, function(err, list = []) {
    return err ? resolve([]) : resolve([ ...list.map(x => `${dir}/${x}`)]);
  });
});





const dir = RoseTree.of('./node_modules');
const toRoseTree = xs => Task.of(xs.map(x => RoseTree.of(x))); 


const program = pipe(
  getNode,
  read,
  chain(toRoseTree)
);

const data = 
  program(dir)
  .fork(e => console.error('error : ', e), console.log);





// const tree = new RoseTree(1, [RoseTree.of(2), new RoseTree(3, [RoseTree.of(4)])]);
// const a = new RoseTree('a', [RoseTree.of('a1'), new RoseTree('c', [RoseTree.of('c1')])]);
// const ab = new RoseTree('ab', [ new RoseTree('ab1', [RoseTree.of('ab2')]) ]);
// const b = RoseTree.of(21);
// const fm = RoseTree.of(2);

// // console.log(tree.map(x=> x.node || x));
// // const bb = a.ap(new RoseTree(x=> x, [RoseTree.of(x  => x + 3), RoseTree.of(x  => x + 4)]))
// // console.log(bb);

// // hagamos el lift nuestro adorado anscensor
// const c = lift2(x => y => `${x} plus  ${y}`)(a)(ab);

// const n = c.reduce((acc, x)=> [...acc, x], []);

// console.log(n);

// // const example = new RoseTree( 1, [
// //   new RoseTree(2, [RoseTree.of(9), new RoseTree(3, [
// //     new RoseTree(4, [])
// //   ])]),
  
// // ]);
// // const example = new RoseTree(1, [new RoseTree(2, [new RoseTree(3, [RoseTree.of(4)]), new RoseTree(5, [RoseTree.of(12)])])]);


// // console.log(n, '1111111111', reduce(example));

