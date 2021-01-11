const cheerio = require('cheerio')
const IO = require('./fp/monad/io')
// const S = require('sanctuary')
const {create, env} = require ('sanctuary')
const R = require('ramda')
const $ = require ('sanctuary-def')
const code  = '<h2 class="title">Hello world</h2><h3>hola a todos</h3>' 
const ioTypeIdent = 'fp-units/io';
const IOType = $.NullaryType
  ('IO')
  ('http://example.com/my-package#Maybe')
  ([])
  (x => x != null)

const S = create ({checkTypes: true, env: env.concat([ IOType ])})
// $('h2.title').text('Hello there!')
// $('h2').addClass('welcome')

// const cheerioIO = body => S.of(IO)(cheerio.load(body))
// const _ = cheerioIO(code)
// const h2 = S.of(IO)($=> $('h2'))
// const m = S.traverse(Array) ($ => S.of(IO)(x => console.log(x, '123123123123') || x) ) (cheerioIO(code))
// const c = S.traverse (IO) (x =>  x.split('')) (S.of(IO)('abc cde edkd'))

// const m = _.ap(S.of(IO)($ => $('h2')))


// console.log(_, c, m, 'depriox')



// const b =IO.of(x => x +1)
const M = R.traverse(S.of(IO), x=> S.of(IO)(x +1), [1,2, 5])
const K = S.traverse (S.of(IO)) (x => console.log('llanmalko ', x) || S.of(IO)(x + 2)) ([1, 90])

// v['fantasy-land/ap'](u['fantasy-land/ap'](a['fantasy-land/map'](f => g => x => f(g(x))))) is equivalent to 
// v['fantasy-land/ap'](u)['fantasy-land/ap'](a) (composition)


const v = S.of(IO)(6)
const u = S.of(IO)(x => x + 122);
const a =  S.of(IO)(x => x +1)
console.log(v.ap(u.ap(a.map(f => g => x => f(g(x))))).unsafePerformIO())
console.log(v.ap(u).ap(a).unsafePerformIO())
console.log(M.unsafePerformIO())