// ReaderT

const $ = require('sanctuary-def')
const type = require ('sanctuary-type-identifiers')
const Z = require('sanctuary-type-classes')
const readerTTypeIdent = 'my/readerT@1'
const { curry} = require('ramda')

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
            ['fantasy-land/chain']: chain,
            ['fantasy-land/ap']: ap,
        }
    }
    return ReaderT(curry(Z.of)(Monad))
}


module.exports = _ReaderT

