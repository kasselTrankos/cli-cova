const { Maybe, Task } = require('./fp/monad');
const daggy = require('daggy');
const pipe = (...fns) => x => fns.reduceRight((acc, fn)=> fn(acc) , x);
const map = f => xs => xs.map(f);
const chain = f => xs => xs.chain(f);



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
const lift = (f, a, b) => a.map(f).ap(b);
const sequence = xs =>xs.reduce((acc, x) => lift(appends, x.alt(Task.of([])), acc), Task.of([]));
const appends = x => xs => [...xs, ...x];
const getIds = x => new Task((reject, resolve)=> {
    setTimeout(()=>{
        return (x === 3) 
        ? reject([])
        : resolve([x + 900])
    }, 90)
});

const proc1 = pipe(
    sequence,
    map(getIds)
);
const er = new Task((reject, resolve)=> reject(90));

proc1([1,2,3,4])
    .fork(console.error, console.log);

er.alt(getIds(9))
    .fork(console.error, console.log)