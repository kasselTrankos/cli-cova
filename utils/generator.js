const { prop } = require('ramda')
const fl = require('fantasy-land')
// generator


// Generator :: [a] -> Generator [a]
function Generator(arr) {
  this._value = arr;
  this._indice = 0;
}
//  of :: Applicative  f => a -> f a
Generator[fl.of] = Generator.of = function(arr) {
  return new Generator(arr)
}

// next () -> * null
Generator.prototype.next = function(){
  return this._indice < this._value.length
    ? prop(0, this._value.slice(this._indice++, this._indice + 1))
    : null
}

// extract :: () f => () -> a
Generator.prototype.extract = function() {
  return this._value
}

module.exports = Generator