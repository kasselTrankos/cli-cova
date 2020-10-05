const { Maybe, Task } = require('./fp/monad');
const daggy = require('daggy');
const {readdir, stat, exists} = require('fs');



const Animal = daggy.taggedSum('Animal', {
  Alive : ['v'],
  Dead : []
});




// map :: Functor a => f a -> (a -> b) ~> b
Animal.prototype.map = function(f) {
  return this.cata({
    Alive: v => Animal.Alive(f(v)),
    Dead:() => Animal.Dead
  });
}

/// quit from context???
/// mmm easy with chain?

// flatmap :: + f a => a -> (a -> b) -> b
Animal.prototype.flatmap = function(f) {
  return this.map(f).cata({
    Alive: x => x,
    Dead: () => Animal.Dead
  });
}

// chain :: Chain m => m a ~> (a -> m b) -> m b4
Animal.prototype.chain = function(b) {
  return this.cata({
    Alive: v => Animal.Alive(b.v(v)),
    Dead: Animal.Dead
  });
}

// alt :: Alt f => f a ~> f a -> f a
Animal.prototype.alt = function(b) {
  return this.cata({
    Alive: _=> this,
    Dead: _=>  b
  });
}
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
const sequence = xs =>xs.reduce((acc, x) => lift(appends, _default(x), acc), empty);
const appends = x => xs => [...xs, ...x];
const read = s => new Task((reject, resolve) => {
  readdir(s, (err, files) => { 
    return (err) ? reject([]) : resolve(files);
  });
});
const proc1 = pipe(
    sequence,
    map(isDirectory)
);
const proc2 = pipe(
  chain(proc1),
  read
);
const er = new Task((reject, resolve)=> reject(90));
const dirs = ['./fp', './fp/monad', './0', './node_modules', './fp/mal']
proc2('./')
  .fork(console.error, console.log);
// proc1(dirs)
//     .fork(console.error, console.log);
