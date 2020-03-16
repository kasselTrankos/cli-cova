const {Maybe} = require('./fp/monad');
const {Just, Nothing} = Maybe;
const {chain , composeK} = require('ramda');

const multiply10 = x => Just(x * 10);
const add20 = x => Just(x + 20);
// 
// // (associativity)
// //m['fantasy-land/chain'](f)['fantasy-land/chain'](g) 
// // m.chain(f).chain(g)
const a = Just(100).chain(multiply10).chain(add20)
console.log(a, ' A is 1020');
// console.log('===================')
// // is equivalent to m['fantasy-land/chain'](x => f(x)['fantasy-land/chain'](g)) 
// // chain(composeK(f, g))(m)
const b = chain(composeK(add20, multiply10))(Just(100));
console.log(b, ' B is 1020');

const toNothing = x => Nothing;
// chain to Nothing
const c = Just(100).chain(toNothing).chain(x => Just(90));
console.group(c, ' Just.chain(Nothing).chain(Just) is Nothing');
// chain always nothing
const d = Just(90).chain(toNothing).chain(toNothing)
console.group(d, ' Just.chain(Nothing).chain(Nothing) is Nothing' );

