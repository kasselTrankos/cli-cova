const {Task, Maybe} = require('./fp/monad');
const {tagged, taggedSum} = require('daggy');
const {readdir, statSync, existsSync} = require('fs');
const {pipe, map, chain, ap} = require('ramda');
const PATH = './node_modules'
// lamdas
const liftF = command => Suspend(command, Pure);
const compose = (f, g) => x => f(g(x))
const kCompose = (f, g) => x => f(x).chain(g);
const I = x => x;

// const Maybe = taggedSum('Maybe', {Just: ['x'], Nothing: []});
const {Just, Nothing} = Maybe;
// Return(a: A): Free[F[_], A] -- Sequential  Pure
// Suspend(f: F[Free[F,A]]): Free[F[_], A] --- Parallel
// const Free = taggedSum('Free', {Pure: ['x'], Suspend: ['f', 'x']});
// const {Suspend, Pure} = Free;
// Free.of = Pure;
// Free.prototype.chain = function (g){
//   return this.cata({
//     Pure: x => g(x),
//     Suspend: (x, f) =>  Suspend(x, kCompose(f, g))
//   });
// }

// Free.prototype.map = function(f) {
//   return this.chain(a => Free.of(f(a)))
// }
// const freeMaybe = free => free.cata({
//   Pure: I,
//   Suspend: (m, q) => m.cata({
//     Just: x => runMaybe(q(x)),
//     Nothing: Nothing
//   })
// });
const toTask = maybe => console.log('Maybe', maybe) || maybe.cata({
  Just: x => console.log(`Just(${x})`) || Task.of([x]),
  Nothing: () =>  Task.of([])
});
const lift2 =(f, a, b, c) => c.ap(b.ap(a.map(f)));
const lift =(f, a, b) => b.ap(a.map(f));
const append = x => xs => [...x, ...xs];
// const just = compose(liftF, Just)
// const nothing = liftF(Nothing)
const isDir = path => statSync(path).isDirectory() ? Just(path) : Nothing;
const exists = path => console.log('E ->', path) || existsSync(path) ? Just(path) : Nothing;
const read = dir => console.log(`read(${dir})`) || new Task((reject, resolve)=> {
    readdir(dir, function(err, list = []) {
    return err ? reject(err) : resolve(list.map(x => `${PATH}/${x}`));
  });
});

// aqui va la recusividad
const readDir = xs =>  xs.reduce((acc, x)=> lift(append, read(x), acc), Task.of([]));
// const readDir = xs =>  console.log('rere --->' , xs) || xs.reduce((acc, x)=> lift(append, read(`${x}/node_modules`), acc), Task.of([]));
const car = pipe(
  exists,
  chain(isDir),
  toTask,
  map(x => console.log(`CAR(${x})`) || x),
  chain(readDir),
);
const truck = pipe(
  chain(car),
  // chain(onlyDir),
);

// caminon de camniones
const program = pipe(
  map(x => console.log(`car(${x})`) || car(x)),
  // map(console.log),
  
  // chain(onlyDir),
  // map(truck),
  // validDir,
  // chain(redus),
  // map(x=> x.flatMap(x=> x))
);
// const j = transform('./node_moduleds')
//   .fork(e => console.error('soy el error', e), x => console.log(x, '0000'));
// const h = program(PATH)
//   .fork(c => console.error('00d0dd', c), (data) => console.log('files is ->: ', data));
const kk = program(['./node_modules'])
  .fork(e => console.log('soy el error: ', e), a=> console.log('folders are ---> ', a));