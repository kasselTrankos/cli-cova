// ReaderT

const $ = require('sanctuary-def')
const type = require ('sanctuary-type-identifiers')
const Z = require('sanctuary-type-classes')
const readerTTypeIdent = 'my/readerT@1'
const { curry, curryN} = require('ramda')
const Reader = require('./reader')

// const prototype = {
//     /* eslint-disable key-spacing */
//     'constructor':            _ReaderT,
//     '@@type':                 readerTTypeIdent,
//     'runWith':                ReaderT$runwith,
//     // '@@show':                 Tuple$prototype$show,
//     // 'fantasy-land/compose':   Tuple$prototype$compose,
//     // 'fantasy-land/map':       Tuple$prototype$map,
//     // 'fantasy-land/bimap':     Tuple$prototype$bimap,
//     // 'bimap':                  Tuple$prototype$bimap,
//     'fantasy-land/map':       ReaderT$prototype$map,
//     'map':       ReaderT$prototype$map,
//     'of':       ReaderT$prototype$of,
//     // 'both':                   Tuple$prototype$both,
//     // 'fantasy-land/concat':    Tuple$prototype$concat,
//     // 'concat':                 Tuple$prototype$concat,
//     // 'fantasy-land/concat':    Tuple$prototype$concat,
//     // 'fantasy-land/reduce':    Tuple$prototype$reduce,
//     // 'fantasy-land/traverse':  Tuple$prototype$traverse,
//     'fantasy-land/ap':    ReaderT$prototype$ap,
//     'ap':    ReaderT$prototype$ap,
//     'fantasy-land/chain':    ReaderT$prototype$chain,
//     'chain':    ReaderT$prototype$chain,
//     // 'fantasy-land/extend':    Tuple$prototype$extend,
//     // 'fantasy-land/extract':   Tuple$prototype$extract
//     /* eslint-enable key-spacing */
//   }
function _ReaderT(Monad)  {
    const readerT = Object.create({})
    readerT.m = Monad
    function ReaderT(wrapper) {

        function runWith(a) {
            return wrapper(a)
        }
        // map :: ReaderT e (m a) ~> (a -> b ) -> ReaderT e (m b) 
        function map(f) {
            return ReaderT(x => Z.map(f, runWith(x)))
        }

        // ap :: ReaderT e m(a -> b ) ~>  m (a) -> ReaderT e ( m b)
        function ap(that) {
            return ReaderT(x => Z.ap(that, runWith(x)))
        }

        // chain :: ReaderT e (m a) ~>  (a -> ReaderT e (m b)) -> ReaderT e ( m b)
        function chain(f) {
            return ReaderT(x => Z.chain(f, runWith(x)))
        }
        
        return {
            runWith, map, chain, ap,
            ['fantasy-land/map']: map,
        }
    }
    return ReaderT(curry(Z.of)(Monad))
}

function ReaderT$prototype$of(v) {
    return ReaderT(Z.of(this.m, v))
}

function ReaderT$runwith(v) {
    console.log(this.m, v)
    this.m(v)
}



 





module.exports = _ReaderT

