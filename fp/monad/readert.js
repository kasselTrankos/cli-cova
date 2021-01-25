// ReaderT

const Z = require('sanctuary-type-classes')
const $ = require('sanctuary-def')
const type = require ('sanctuary-type-identifiers')
const Z = require('sanctuary-type-classes')
const readerTTypeIdent = 'my/readerT@1'

const prototype = {
    /* eslint-disable key-spacing */
    'constructor':            ReaderT,
    '@@type':                 readerTTypeIdent,
    'runWith':                ReaderT$runwith,
    // '@@show':                 Tuple$prototype$show,
    // 'fantasy-land/compose':   Tuple$prototype$compose,
    // 'fantasy-land/map':       Tuple$prototype$map,
    // 'fantasy-land/bimap':     Tuple$prototype$bimap,
    // 'bimap':                  Tuple$prototype$bimap,
    'fantasy-land/map':       ReaderT$prototype$map,
    'map':       ReaderT$prototype$map,
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

function ReaderT(m)  {
    const readerT = Object.create(prototype)
    
    readerT.m = m
    return readerT
}

function ReaderT$runwith(v) {
    return this.f(v)
}

function ReaderT$prototype$map(f) {
    return ReaderT(x => runWith(x).map(f) )
}

module.exports = ReaderT

