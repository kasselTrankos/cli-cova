const {Task, Maybe} = require('./fp/monad');
const {tagged, taggedSum} = require('daggy');
const path = require("path");
const {pipe, map, chain, ap, curry} = require('ramda');
const {readdir, statSync, existsSync} = require('fs');

const DIRS = ['./node_modules'];
const {Just, Nothing} = Maybe;

// :: Maybe -> Task
const toTask = maybe => maybe.cata({
  Just: x => Task.of(x),
  Nothing: () => Task.of([])
});
// :: String -> Task
const read = dir => new Task((reject, resolve)=> {
  readdir(dir, function(err, list = []) {
    return err ? reject(err) : resolve(list.map(x => `${dir}/${x}`));
  });
});
const appends = x => xs => [...x, ...xs];
const lift2 = (f, a, b) => b.ap(a.map(f));
// :: String -> Maybe
const isDir = path => statSync(path).isDirectory() ? Just(path) : Nothing;

// :: String -> Maybe
const isHidden = p => /^\./.test(path.basename(p)) ? Nothing : Just(p);

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
const car = (T, dirs) =>
	sequence(T, dirs.map(folder))

const bicycle = curry(car);
const trunk = pipe(chain(bicycle(Task)));

const program = pipe(
	bicycle(Task),
	trunk
	// map(map(x=> x+ 'jjfifjif'))
	// chain(map(clearData)),
	// map(x => console.log(x, '4444444444444'))
	// chain(x=> console.log('valor', x)),
	// arrToTask
);

const m = program(DIRS);
m.fork(console.error, console.log)
console.log(m)