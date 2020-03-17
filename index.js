const {Task, Maybe} = require('./fp/monad');
const {tagged, taggedSum} = require('daggy');
const {readdir, statSync, existsSync} = require('fs');
const path = require("path");
const {pipe, map, chain, ap} = require('ramda');
const PATH = './node_modules'
const SHOW_HIDDEN = false;
// lamdas
const compose = (f, g) => x => f(g(x))

// const Maybe = taggedSum('Maybe', {Just: ['x'], Nothing: []});
const {Just, Nothing} = Maybe;
const toTask = maybe =>  maybe.cata({
  Just: x => Task.of([x]),
  Nothing: () => new Task(reject=> reject([]))
});
const toArray = maybe => maybe.cata({
  Just: x => [x],
  Nothing: () => []
});
const toMaybe = x => Just(x);
const lift2 = (f, a, b, c) => c.ap(b.ap(a.map(f)))
const lift = (f, a, b) => b.ap(a.map(f));
  const appends = x => xs => [...x, ...xs];
// const just = compose(liftF, Just)
// const nothing = liftF(Nothing)
const isDir = path => statSync(path).isDirectory() ? Just(path) : Nothing;
const isHidden = p => /^\./.test(path.basename(p)) ? Nothing : Just(p);
const exists = path => existsSync(path) ? Just(path) : Nothing;
const read = dir => new Task((reject, resolve)=> {
  readdir(dir, function(err, list = []) {
    return err ? reject(err) : resolve(list.map(x => `${dir}/${x}`));
  });
});
// aqui va la recusividad
const readDir = xs => xs.reduce((acc, x) => lift(appends, read(x), acc), Task.of([]));
const traverse = xs => xs.reduce((acc, x) => lift2(append, Task.of(x), read(x), acc), Task.of([]));
const DIRS = ['./node_modules', '/Users/aotn', '/Users/aotn/GEMA/components'];
const onlyDirs = x =>  x.ap(Task.of(x=> x.map(onlyDir).flat()));
const clearData = pipe(
  exists,
  chain(isDir),
  chain(isHidden),
); 
const car = pipe(
  clearData,
  toTask,
  chain(readDir),
  onlyDirs
  // readDir,
  );
const onlyDir = pipe(
  clearData,
  toArray
);
const truck = pipe(
  chain(x => console.log(x, 'aaaaaaaa') || car(x)),
  map(x => console.log(x, '00000000') || x),
);
const program = pipe(
  map(car),
  map(x => console.log(x, '00000000') || x.ap(Task.of(x =>console.log(x, '111111111') || x)))
  // map(ap(Task.of(car))),
  // map(readDir)
  // map(ap(Task.of(2))),
  // getHead,
);
// const k = program(DIRS);
// // console.log(k, '00000000')
// k.map(t => t.fork(d => console.log('error', d), x => console.log('gol', x)))
  // k.fork(console.log, console.log)

