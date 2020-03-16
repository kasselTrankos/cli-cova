const {Task, Maybe} = require('./fp/monad');
const {tagged, taggedSum} = require('daggy');
const {readdir, statSync, existsSync} = require('fs');
const {pipe, map, chain, ap} = require('ramda');
const PATH = '/Users/aotn'
// lamdas
const liftF = command => Suspend(command, Pure);
const compose = (f, g) => x => f(g(x))
const kCompose = (f, g) => x => f(x).chain(g);
const I = x => x;

// const Maybe = taggedSum('Maybe', {Just: ['x'], Nothing: []});
const {Just, Nothing} = Maybe;
// Return(a: A): Free[F[_], A] -- Sequential  Pure
// Suspend(f: F[Free[F,A]]): Free[F[_], A] --- Parallel
const Free = taggedSum('Free', {Pure: ['x'], Suspend: ['f', 'x']});
const {Suspend, Pure} = Free;
Free.of = Pure;
Free.prototype.chain = function (g){
  return this.cata({
    Pure: x => g(x),
    Suspend: (x, f) =>  Suspend(x, kCompose(f, g))
  });
}

Free.prototype.map = function(f) {
  return this.chain(a => Free.of(f(a)))
}
// const freeMaybe = free => free.cata({
//   Pure: I,
//   Suspend: (m, q) => m.cata({
//     Just: x => runMaybe(q(x)),
//     Nothing: Nothing
//   })
// });
const naturalTransformTask = maybe => maybe.cata({
  Just: x => Task.of(x),
  Nothing: () =>  new Task(reject => reject('no hay datos'))
});
const lift2 =(f, a, b, c) => c.ap(b.ap(a.map(f)));
const toString = value => String(value);
// const just = compose(liftF, Just)
// const nothing = liftF(Nothing)
const isDir = path => console.log(path, 'pero como') || statSync(path).isDirectory() ? Just(path) : Nothing;
const exists = path => console.log('malamente', existsSync(path), Nothing) || existsSync(path) ? Just(path) : Nothing;
const transform = compose(naturalTransformTask, exists, toString);
const read = dir => new Task((reject, resolve)=> {
  readdir(dir, function(err, list) {
    return err ? reject(err) : resolve(list.map(x => `${PATH}/${x}`));
  });
});
const append = x => y => xs => [x, y, ...xs];


const path = x => `${PATH}/${x}`;

// aqui va la recusividad
const redus = xs => xs.reduce((acc, x)=> lift2(append, Task.of(x), read(x), acc), Task.of([]))

const program = pipe(
  read,
  chain(redus),
  // map(x=> x.flatMap(x=> x))
  
);

const j = transform('./node_moduleds')
  .fork(e => console.error('soy el error', e), x => console.log(x, '0000'));
// const h = program(PATH)
//   .fork(c => console.error('00d0dd', c), (data) => console.log('0das0dassad', data));