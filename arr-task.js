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
  Nothing: () => Task.of('')
});
// :: String -> Task
const read = dir => new Task((reject, resolve)=> {
	console.log(dir, '00000000000');
  readdir(dir, function(err, list = []) {
    return err ? resolve([]) : resolve([ ...list.map(x => `${dir}/${x}`)]);
  });
});
const appends = x => xs => [...x, ...xs];
const lift2 = (f, a, b) => b.ap(a.map(f));
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
const wheel = (T, dirs) => sequence(T, dirs.map(folder))

const bicycle = curry(wheel);
const moto = bicycle(Task);

const car = pipe(
	map(map(x => `${x}/node_modules`)),
	chain(moto)
);

const program = pipe(
	moto,
	car
	// map(map(x=> x+ 'jjfifjif'))
	// chain(map(clearData)),
	// map(x => console.log(x, '4444444444444'))
	// chain(x=> console.log('valor', x)),
	// arrToTask
);

const m = program(DIRS);
m.fork(e => console.error('error : ', e), console.log)
console.log(m)