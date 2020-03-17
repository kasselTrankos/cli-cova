const {Task, Maybe, Pair} = require('./fp/monad');
const {tagged, taggedSum} = require('daggy');
const path = require("path");
const {pipe, map, chain, ap, curry} = require('ramda');
const {readdir, statSync, existsSync} = require('fs');

const DIRS = ['./node_modules'];
const {Just, Nothing} = Maybe;
// monkey patch
Array.empty = () => [];
const State = Pair(Array);
const I = x => x;

// :: Maybe -> Task
const toTask = maybe => maybe.cata({
	Just: x => Task.of(x),
  Nothing: () => Task.of('')
});

// :: String -> Task
const read = dir => new Task((_, resolve)=> {
  readdir(dir, function(err, list = []) {
    return err ? resolve([]) : resolve([ ...list.map(x => `${dir}/${x}`)]);
  });
});
const appends = x => xs => [...x, ...xs];
const lift2 = (f, a, b) => b.ap(a.map(f));
// :: String -> Maybe
const isDir = path => console.log(path, '00000') || statSync(path).isDirectory() ? Just(path) : Nothing;

// :: String -> Maybe
const isHidden = dir => /^\./.test(path.basename(dir)) ? Nothing : Just(dir);

// :: String -> Maybe
const exists = path => console.log(path, '00000000000') || existsSync(path) ? Just(path) : Nothing;

// const traverse = (T, xs) => xs.reduce((acc, x) => lift2(appends, Task.of(x),  acc), T.of([]));
const sequence = (T, xs) =>console.log(xs, '1111111111') || xs.reduce((acc, x) => lift2(appends, x,  acc), T.of([]));




const valid = pipe(
  exists,
	chain(isDir),
	chain(isHidden),
	toTask,
);
const folder = pipe(
  valid,
  chain(read),
); 
    
//  :: [String] -> Task e [DIR]
const wheel = (T, dirs) => sequence(T, dirs.map(map(folder)));
const bicycle = curry(wheel);
const moto = bicycle(Task);
const program = pipe(
  moto
);
const d = State.of(DIRS) 
const k = program(d);
console.log(k._2)
//  k._2.fork(console.error, console.log)


