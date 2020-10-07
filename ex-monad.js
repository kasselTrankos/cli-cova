const { Maybe, Task } = require('./fp/monad');
const daggy = require('daggy');
const {readdir, stat, exists} = require('fs');
const { I } = require('./lambda');
const { append } = require('sanctuary');
/// quit from context???
/// mmm easy with chain?

const isDirectory = s => new Task((reject, resolve)=> {
  stat(s, (err, stats) => { 
    if (err)  return reject([]); 
    return (stats.isDirectory())
    ? resolve([s])
    : reject([])
  }); 
});

const pipe = (...fns) => x => fns.reduceRight((acc, fn)=> fn(acc) , x);
const map = f => xs => xs.map(f);
const chain = f => xs => xs.chain(f);
const empty = Task.of([]);
const _default = x => x.alt(empty);
const lift = (f, a, b) => a.map(f).ap(b);
const sequence = xs =>  xs.reduce((acc, x) => lift(appends, _default(x), acc), empty);
const sequence1 = xs => xs.reduce((acc, x) => lift(appends, _default(x), acc), empty);
const appends = x => xs => [...xs, ...x];
  const read = s => new Task((reject, resolve) => readdir(s, (err, files) =>  
    err ? reject([]) : resolve(files.map(c => `${s}${c}/`))
));

const gp = s => console.log(s, '1111111111') || Task.of(s);
const nolo = c => c + '0000';
const log = s => x => {
  console.log(`LOG(${s}):::`, x);
  return x;
}
const proc1 = pipe(
  // map(proc2),
  // chain(xs => Task.of(proc2(xs))),
  map(map(read)),
  map(log('huevo')),
  map(I),
);
const proc = pipe(
  chain(xs => Task.of(sequence1(xs))),
  map(isDirectory),
    
);
// function proc1(x) {
//   pipe(
//     sequence,
//     map(isDirectory)
//   )(x);
// }
const seq = chain(xs => Task.of(sequence(xs)));
function proc2 (x) {
  log('9999')(x)
  return pipe(
    // proc1,
    // seq,
    // map(chain(proc)),
    // chain(xs => Task.of(xs.map(read)))
    // map(sequence),
    // map(map(read)),
    // map(sequence),
    seq,
    chain(c => Task.of(c.map(read))),
    map(map(log('0000111111'))),
  )(x);
}
// const proc2 = pipe(
//   chain(proc1),
//   read
// );
const er = new Task((reject, resolve)=> reject(90));
const on = xs => xs.reduce((acc, x)=> appends(_default(x))(acc), Task.of([]));
const dirs = ['./fp', './fp/monad', './0', './node_modules', './fp/mal'];
const f = ['./']
const t = Task.of(f);
const p = pipe(
  chain(I),
  // map(map(isDirectory)),
  chain(xs => Task.of(sequence(xs))),
  // map(map(map(map(isDirectory)))),
  map(map(read))
);

p(t)
  .fork(console.error, log('0'))
