// b

const Tuple = require('./fp/monad/tuple')
const Sum = require('./fp/monad/sum')
const type = require ('sanctuary-type-identifiers')
const IO = require('./fp/monad/io')
const {create, env, sum} = require ('sanctuary')
const $ = require('sanctuary-def')
// const S = require('sanctuary')

const $Sum = $.UnaryType
('Sum')
('http://example.com/my-package#Sum')
([])
(x => type(x) === 'my/sum@1')
(({value}) => [value] )

const $Tuple = $.BinaryType
  ('Tuple')
  ('http://example.com/my-package#Tuple')
  ([])
  (x => type(x) === 'my/tuple@1')
  ( ({fst}) => [fst] )
  ( ({snd}) => [snd] )

const S = create ({checkTypes: true, env: env.concat( [ 
  $Sum ($.ValidNumber),
  $Tuple ($.Any) ($.Any),
] )})



// const A = 
//   S.concat(Tuple( [1] ) (Sum(1))) (Tuple([1]) (Sum(1)))
//   // .concat (Tuple (S.Just ([1, 2, 3])) ([6]))
  // .bimap(x => x +2, x => x +4)
  // .both(x => x +3)


console.log( S.concat(Sum(9)) (Sum(0)) )

console.log(S.concat( Tuple(Sum(112)) (Sum(2)) ) (Tuple(Sum(9)) (Sum(9))))
