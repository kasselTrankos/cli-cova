const {Task, Maybe, RoseTree} = require('./fp/monad');
const { Nothing, Just} = Maybe;
const {map, chain, curry, ap, lift} = require('ramda');
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const {readdir, lstat, statSync, existsSync} = require('fs');
const S = require('sanctuary');
const { json } = require('jsverify');

// const { pipe } = S;
const lift2 = (f, a, b) => a.map(f).ap(b);
const I = x => x;
const append = x => xs => [...x, ...xs];
// const ap = x => Task.ap(x)

// :: prop => String -> Object -> Any
const prop = key => obj => obj[key];

const getNode = prop('node');

// :: isDirectory String -> Task String
const isDirectory = path => new Task((reject, resolve) => lstat(path, (e, stats) =>
  (e || !stats.isDirectory()) 
    ? resolve([])
    : resolve([path])
));

// :: setRoseTree String -> RoseTree
const setRoseTree = x => RoseTree.of(x);

// :: read String -> Task [String]
const read = dir => new Task((_, resolve)=> {
  readdir(dir, (err, list = []) => err ? resolve([]) : resolve([ ...list.map(x => `${dir}/${x}`)]));
});



// :: toRoseTree -> Task [RoseTree]
const toRoseTree = parent => xs => Task.of(parent.concat(xs.map(setReturn))); 

const sequence = (T, xs) => xs.reduce((acc, x) => lift2(append, x, acc), T.of([]));
// :: toTask => Array -> Task []
const toTask = xs => sequence(Task, xs.map(isDirectory));



const again = pipe(
  toRoseTree,
  
  // chain(c => Task.of(c))
  // read,
  // chain(c => console.log(c, '444444444') || toTask(isDirectory)(c))
);


const setReturn = pipe(
  RoseTree.of,
  // chain(x => console.log(x, '1111111') || Task.of(add(x)))
  // ap(Task.of(x => addx(X)))
  // ap(Task.of(x => console.log(x, '2222222222222' || x))),
  //x => console.log(x, '00000000') || x,
  // getNode,
  // again,
  //chain(c => console.log(c, '000000000') || again(c)),
  // chain(read),
  // chain(toTask(isDirectory)),
  // chain(toRoseTree(dir)),
);

const add = dir => pipe(
  getNode,
  read,
  chain(toTask),
 
  chain(again(dir)),
  // setReturn
);

const dir = RoseTree.of('./node_modules');

const program = dir => pipe(
  add(dir),
  
)(dir);
// const rerun = pipe(
//   setRoseTree,
//   program
// );


const log = x => console.log(JSON.stringify(x));

const data = 
  program(dir)
  .fork(e => console.error('error : ', e), log);

// const tt = pipe(
//   Task.of,
//   ap(Task.of(c => console.log(c, '111111111111111') || c + 119))
// );
// tt(1)
//   .fork(console.error, console.log)





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

