const {Task, Maybe, RoseTree} = require('./fp/monad');
const { Nothing, Just} = Maybe;
const {map, chain, curry, ap, lift} = require('ramda');
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const {readdir, lstat, statSync, existsSync} = require('fs');
const S = require('sanctuary');
const { json } = require('jsverify');
const { value } = require('sanctuary');

// const { pipe } = S;
const lift2 = (f, a, b) => a.map(f).ap(b);
const I = x => x;
const append = x => xs => [...x, ...xs];
// const ap = x => Task.ap(x)

// :: prop => String -> Object -> Any
const prop = key => obj => obj[key];

const getNode = prop('node');
const getPath = value => value.node
  ? `${getNode(value)}/node_modules`
  : value;

// :: isDirectory String -> Task String
const isDirectory = path => new Task((reject, resolve) => lstat(path, (e, stats) =>
  (e || !stats.isDirectory()) 
    ? resolve([])
    : resolve([path])
));

// :: read String -> Task [String]
const read = dir => new Task((_, resolve)=> {
  readdir(dir, (err, list = []) => err ? resolve([]) : resolve([ ...list.map(x => `${dir}/${x}`)]));
});



// :: toRoseTree -> Task [RoseTree]
const toRoseTree = parent => xs => Task.of(parent.concat(xs.map(RoseTree.of))); 

const sequence = (T, xs) => xs.reduce((acc, x) => lift2(append, x, acc), T.of([]));
// :: toTask => Array -> Task []
const toTask = xs => sequence(Task, xs.map(
  pipe(
    getPath,
    isDirectory
  )
));

const rerurn = ({_, forest}) => toTask(forest).fork(console.log, c => console.log(c, '11111111111111'));

const add = dir => pipe(
  map(d => console.log(d, '-1111111111') || d),
  getNode,
  read,
  chain(toTask),
  chain(toRoseTree(dir)), // moldeado como rose Treee
  ap(Task.of(rerurn))
  // map(x => console.log(x.forest, '000000') || x)
  // chain(x => console.log(x.forest, '000000') ||  Task.of(x))
);

const dir = RoseTree.of('./node_modules');

const program = dir => pipe(
  add(dir),
)(dir);

// const log = x => console.log(JSON.stringify(x));
const log = console.log

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

