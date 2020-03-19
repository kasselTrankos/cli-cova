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
const lift2 = (f, a, b) => b.ap(a.map(f));
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

// :: String -> Maybe
const isDir = path => statSync(path).isDirectory() ? Just(path) : Nothing;

// :: String -> Maybe
const isHidden = dir => /^\./.test(path.basename(dir)) ? Nothing : Just(dir);

// :: String -> Maybe
const exists = path => existsSync(path) ? Just(path) : Nothing;

// const traverse = (T, xs) => xs.reduce((acc, x) => lift2(appends, Task.of(x),  acc), T.of([]));
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(appends, x,  acc), T.of([]));

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
const oneWheel = (T, dirs) => sequence(T, dirs.map(folder));
const bicycle = curry(wheel);
const moto = bicycle(Task);
const car = pipe(
  map(x => console.log(x, '000000') || x),
  map(map(map(x => `${x}/node_modules`))),
  // moto
	// chain(moto)
  );
const program = pipe(
  moto,
  car
);
const d = State.of(DIRS) 
//!!! :: Task -> Pair._2 -> Array ---- esto es l o que debiera
// siendo :: Pair -> Task -> Array
const k = program(d);
console.log(k._2)
/// 
// el problema es que es un pair no un Task
 k._2.fork(console.error, console.log)


