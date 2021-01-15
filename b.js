// b

const Tuple = require('./fp/monad/tuple')
const Sum = require('./fp/monad/sum')
const $ = require('sanctuary-def')
const {create, env, sum} = require ('sanctuary')

// const S = require('sanctuary')





const S = create ({checkTypes: true, env: env.concat( [ 
  Sum.env ($.ValidNumber),
  Tuple.env ($.Unknown) ($.Unknown),
] )})



// const A = 
//   S.concat(Tuple( [1] ) (Sum(1))) (Tuple([1]) (Sum(1)))
//   // .concat (Tuple (S.Just ([1, 2, 3])) ([6]))
  // .bimap(x => x +2, x => x +4)
  // .both(x => x +3)


// console.log( S.concat(Sum(9)) (Sum(0)) )
// console.log( S.concat(Tuple ([1])([2]) ) (Tuple ([0]) ([5]) ) )

console.log(S.concat( Tuple([112]) (Sum(2)) ) (Tuple([1,2,3]) (Sum(9))))
