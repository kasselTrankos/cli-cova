const { Maybe, Task } = require('./fp/monad');
const daggy = require('daggy');

const { Just, Nothing } = Maybe;


// console.log(Just(3).alt(Nothing))
// console.log(Nothing.alt(Just(10)).alt(Just(9000)));

// console.log(Nothing.cata);
const gg = new Task((reject, resolve)=> {
    setTimeout(()=> resolve('op'), 100);
});
const gg1 = new Task((reject, resolve)=> {
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

const g = Animal.Alive([12, 121]);
const m = Animal.Alive(1);

const ga = x => new Task((reject, resolve) => {
    setTimeout(()=> resolve(x +'aa 100 sdd00 ---- '), 200);
});

gg.chain(ga).chain(c => Task.of(m => m(c))).ap(Task.of(x => x + ' ::::: nurvo soy ')).fork(console.error, console.log);
//fork((res,rej)=> console.log, console.error)
// console.log(g.map(v => v.map(c=>  c* 12)));
// console.log([g.flatmap(x => x.map(g => g * 90))])
// console.log(m.alt(Animal.Dead).alt(Animal.Alive(90000)).flatmap(I));

