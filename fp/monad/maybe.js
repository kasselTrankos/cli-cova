const {taggedSum} = require('daggy');
const Maybe = taggedSum('Maybe', {
    Nothing: [],
    Just: ['x']
});
const {Just, Nothing} = Maybe;

// chain :: Chain m => m a ~> (a -> m b) -> m b
Maybe.prototype.chain = function(f) {
  return this.cata({
    Just: f,
    Nothing: () => Nothing
  });
}

// ap :: Apply f => f a ~> f (a -> b) -> f b
Maybe.prototype.ap = function(that) {
  return this.cata({
    Nothing: Nothing,
    Just: x => that.cata({
      Nothing: () => Nothing,
      Just: c => Just(x)
    })
  });
}
// map:: Functor f => f a ~>(a -> b) -> b 
Maybe.prototype.map = function (f) {
  return this.cata({
    Just: x => Maybe.Just(f(x)),
    Nothing: () => this
  });
}

Maybe.map = Maybe.prototype.map;

// alt :: Alternative f =>...s
Maybe.prototype.alt = function (that) {
  return this.cata({
    Just: () => this,
    Nothing: () => that,
  });
}

Maybe.alt = Maybe.prototype.alt;

Maybe.prototype.of = function(x) {
  return this.cata({
      Just: _ => this,
      Nothing: () => x
  });
}

Maybe.of = x => Just(x);

module.exports = Maybe;