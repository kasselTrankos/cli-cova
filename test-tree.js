const {Task, Maybe, RoseTree} = require('./fp/monad');
const {pipe, map, chain, ap, curry} = require('ramda');
const {readdir, lstat, statSync, existsSync} = require('fs');
const lift2 = (f, a, b) => console.log(a, b) || b.ap(a.map(f));
const I = x => x;
const append = x => xs => [x, ...xs];

// :: prop String -> Object -> Any
const prop = key => obj => obj[key];

// :: isDirectory String -> Task String
const isDirectory = path => new Task((reject, resolve) => lstat(path, (e, stats) =>
  (e || !stats.isDirectory()) 
    ? reject(e)
    : resolve(path)
));
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(append, isDirectory(x),  acc), T.of([]));
const { Nothing, Just} = Maybe;


// :: Maybe String -> Task String String
// const toTask = maybe => maybe.cata({
// 	Just: x => Task.of(x),
//   Nothing: () => Task.of('')
// });



const getNode = prop('node');

// :: String -> Maybe
const isDir = path => statSync(path).isDirectory() ? rerun(path) : Nothing;


const toTask = dirs => sequence(Task, dirs);
const setRoseTree = x => RoseTree.of(x);
const validateDir = pipe(
  toTask
);


// :: String -> Task [RoseTree]
const toRoseTree = parent => xs => Task.of(parent.concat(xs.map(x => RoseTree.of(x)))); 
// :: RoseTree -> Task [] [RoseTree]
const read = dir => new Task((_, resolve)=> {
  readdir(dir, (err, list = []) => err ? resolve([]) : resolve([ ...list.map(x => `${x}`)]));
});


const add = pipe(
  chain(validateDir),
  // chain(toRoseTree(dir)),
);






const dir = RoseTree.of('./node_modules');


const program = pipe(
  getNode,
  read,
  add
);
const rerun = pipe(
  setRoseTree,
  program
);

const data = 
  program(dir)
  .fork(e => console.error('error : ', e), console.log);


  // Pienso que el siguiente paso esta en usar el sequence 
  // recursive :: Task [Array] ->  Task [RoseTree] 
  // Task Array -> 




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

