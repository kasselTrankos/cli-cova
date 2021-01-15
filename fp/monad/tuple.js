// Tuple

const Z = require('sanctuary-type-classes')
const $ = require('sanctuary-def')
const type = require ('sanctuary-type-identifiers')

const tupleTypeIdent = 'my/tuple@1'

var prototype = {
  /* eslint-disable key-spacing */
  'constructor':            Tuple,
  '@@type':                 tupleTypeIdent,
  // '@@show':                 Tuple$prototype$show,
  // 'fantasy-land/compose':   Tuple$prototype$compose,
  // 'fantasy-land/map':       Tuple$prototype$map,
  'fantasy-land/bimap':     Tuple$prototype$bimap,
  'bimap':                  Tuple$prototype$bimap,
  'fantasy-land/map':       Tuple$prototype$both,
  'both':                   Tuple$prototype$both,
  'fantasy-land/concat':    Tuple$prototype$concat,
  'concat':                 Tuple$prototype$concat,
  'fantasy-land/concat':    Tuple$prototype$concat,
  // 'fantasy-land/reduce':    Tuple$prototype$reduce,
  'fantasy-land/traverse':  Tuple$prototype$traverse,
  // 'fantasy-land/extend':    Tuple$prototype$extend,
  // 'fantasy-land/extract':   Tuple$prototype$extract
  /* eslint-enable key-spacing */
}


const $Tuple = $.BinaryType
  ('Tuple')
  ('http://example.com/my-package#Tuple')
  ([])
  (x => type(x) === 'my/tuple@1')
  ( ({fst}) => [fst] )
  ( ({snd}) => [snd] )

function Tuple(fst) {
  return function (snd) {
    const tuple = Object.create(prototype)
    
    tuple.fst = fst
    tuple.snd = snd
    return tuple
  }
}

Tuple.env = $Tuple





// bimap :: Tuple (a, b) => (a-> c, b -> d) -> f c, g d
function Tuple$prototype$bimap(f, g) {
  return Tuple (f(this.fst)) (g(this.snd))
}

// both :: Tuple (a,b) => (a -> b) -> f a, f b 
function Tuple$prototype$both (f) {
    return Tuple (f(this.fst)) (f(this.snd))
}

Tuple.prototype.fst = function() {
    return this.fst
}
Tuple.fst = function(that) {
    return that.fst
}

Tuple.prototype.snd = function() {
    return this.snd
}
Tuple.snd = function(that) {
    return that.snd
}

// concat :: T a -> a -> a 
function Tuple$prototype$concat(that) {
    return Tuple( Z.concat (this.fst, that.fst) ) (Z.concat ( this.snd, that.snd) )
}


// traverse :: Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
function Tuple$prototype$traverse(T, f) {
  return Tuple () ()
}




module.exports = Tuple

