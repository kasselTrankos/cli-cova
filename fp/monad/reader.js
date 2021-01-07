// Reader

const Z = require('sanctuary-type-classes')
const $ = require('sanctuary-def')
const type = require ('sanctuary-type-identifiers')
const compose = f => g =>  x => f(g(x))

const readerTypeIdent = 'my/reader@1'

const prototype = {
    /* eslint-disable key-spacing */
    'constructor':            Reader,
    '@@type':                 readerTypeIdent,
    'runWith':                Reader$runwith,
    // '@@show':                 Tuple$prototype$show,
    // 'fantasy-land/compose':   Tuple$prototype$compose,
    // 'fantasy-land/map':       Tuple$prototype$map,
    // 'fantasy-land/bimap':     Tuple$prototype$bimap,
    // 'bimap':                  Tuple$prototype$bimap,
    'fantasy-land/map':       Reader$prototype$map,
    'map':       Reader$prototype$map,
    // 'both':                   Tuple$prototype$both,
    // 'fantasy-land/concat':    Tuple$prototype$concat,
    // 'concat':                 Tuple$prototype$concat,
    // 'fantasy-land/concat':    Tuple$prototype$concat,
    // 'fantasy-land/reduce':    Tuple$prototype$reduce,
    // 'fantasy-land/traverse':  Tuple$prototype$traverse,
    // 'fantasy-land/ap':    Tuple$prototype$ap,
    // 'fantasy-land/extend':    Tuple$prototype$extend,
    // 'fantasy-land/extract':   Tuple$prototype$extract
    /* eslint-enable key-spacing */
  }

function Reader(f)  {
    const reader = Object.create(prototype)
    
    reader.run = f
    return reader
}

function Reader$runwith(v) {
    return this.run(v)
}

function Reader$prototype$map(g) {
    return Reader( compose (this.run) (g) )
}

module.exports = Reader

