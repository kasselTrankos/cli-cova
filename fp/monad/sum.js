// sum
const $ = require('sanctuary-def')
const type = require ('sanctuary-type-identifiers')

const sumTypeIdent = 'my/sum@1'

var prototype = {
  /* eslint-disable key-spacing */
  'constructor':            Sum,
  '@@type':                 sumTypeIdent,
  // '@@show':                 Tuple$prototype$show,
  // 'fantasy-land/compose':   Tuple$prototype$compose,
  // 'fantasy-land/map':       Tuple$prototype$map,
//   'fantasy-land/bimap':     Sum$prototype$bimap,
//   'bimap':     Sum$prototype$bimap,
//   'fantasy-land/map':      Sum$prototype$both,
//   'both':      Sum$prototype$both,
//   'fantasy-land/concat':      Sum$prototype$concat,
  'concat':      Sum$prototype$concat,
  'fantasy-land/concat':      Sum$prototype$concat,
  // 'fantasy-land/reduce':    Sum$prototype$reduce,
  // 'fantasy-land/traverse':  Sum$prototype$traverse,
  // 'fantasy-land/extend':    Sum$prototype$extend,
  // 'fantasy-land/extract':   Sum$prototype$extract
  /* eslint-enable key-spacing */
}

const $Sum = $.UnaryType
  ('Sum')
  ('http://example.com/my-package#Sum')
  ([])
  (x => type(x) === 'my/sum@1')
  (({value}) => [value] )

function Sum (value) {
    const sum = Object.create(prototype)
    sum.value = value
    return sum
}

Sum.env = $Sum

function Sum$prototype$concat (that) {
  return Sum(this.value + that.value) 
}

module.exports = Sum