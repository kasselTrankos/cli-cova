const { Maybe, Task } = require('./fp/monad');
const daggy = require('daggy');
const { generator } = require('jsverify');
const pipe = (...fns) => x => fns.reduceRight((acc, fn)=> fn(acc) , x);
const lift = (f, a, b) => a.map(f).ap(b);
const map = f => xs => xs.map(f);
const chain = f => xs => xs.chain(f);

// console.log(Just(3).alt(Nothing))
// console.log(Nothing.alt(Just(10)).alt(Just(9000)));

// console.log(Nothing.cata);
const gg = new Task((reject, resolve)=> {
    setTimeout(()=> resolve('op'), 100);
});
const gg1 = new Task((rejecgat, resolve)=> {
    setTimeout(()=> resolve('op222'), 100);
});


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
const sequence = xs =>xs.reduce((acc, x) => lift(appends, x, acc), Task.of([]));
const appends = x => xs => [...xs, x];
const g = Animal.Alive([12, 121]);
const m = Animal.Alive(1);
const ids = [1, 2, 3, 4];
const getIds = x => new Task((reject, resolve)=> {
    setTimeout(()=> resolve(x + 900), 100);
});


const ga = x => new Task((reject, resolve) => {
    setTimeout(()=> resolve(x +'-->es el x'), 200);
});

const a = ga(1);
const b = ga(2)

const c = a.map(x => x).ap(b);
const ba = Task.of([1, 2])


const proc = pipe(
    chain(ga)
);
const proc1 = pipe(
    sequence,
    map(getIds)
);
proc1(ids)
    .fork(console.error, console.log)
//proc(ba).fork(console.error, console.log)