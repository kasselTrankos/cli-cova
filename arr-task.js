const {Task, Maybe} = require('./fp/monad');
const {tagged, taggedSum} = require('daggy');
const path = require("path");
const {pipe, map, chain, ap, curry} = require('ramda');
const {readdir, statSync, existsSync} = require('fs');

const DIRS = ['./node_modules', '/Users/aotn', '/Users/aotn/GEMA/components'];

const {Just, Nothing} = Maybe;
const toTask = maybe => maybe.cata({
  Just: x => Task.of(x),
  Nothing: () => Task.of([])
});
const read = dir => console.log('00000000', dir) || new Task((reject, resolve)=> {
  readdir(dir, function(err, list = []) {
    return err ? reject(err) : resolve(list.map(x => `${dir}/${x}`));
  });
});
const appends = x => xs => [...x, ...xs];
const lift2 = (f, a, b) => b.ap(a.map(f));

const isDir = path => statSync(path).isDirectory() ? Just(path) : Nothing;
const isHidden = p => /^\./.test(path.basename(p)) ? Nothing : Just(p);
const exists = path => existsSync(path) ? Just(path) : Nothing;
const traverse = (T, xs) => xs.reduce((acc, x) => lift2(appends, Task.of(x),  acc), T.of([]));
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(appends, x,  acc), T.of([]));
// car
//   :: [String] -> Task e [DIR]
const car = (T, dirs) =>
	sequence(T, dirs.map(clearData))


const arrToTask = curry(car);
const clearData = pipe(
  exists,
  chain(isDir),
	chain(isHidden),
	toTask,
	chain(read)
	// chain(map(read)),
); 


const program = pipe(
	arrToTask(Task),
	// map(map(x=> x+ 'jjfifjif'))
	// chain(map(clearData)),
	// map(x => console.log(x, '4444444444444'))
	// chain(x=> console.log('valor', x)),
	// arrToTask
);

const m = program(DIRS);
m.fork(console.error, console.log)
// console.log(m)