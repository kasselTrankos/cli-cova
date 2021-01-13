const cheerio = require('cheerio')
const IO = require('./fp/monad/io')
const {create, env, get} = require ('sanctuary')
const R = require('ramda')
const code  = '<h2 class="title">Hello world</h2><h3>hola a todos  doble</h3>' 

const S = create ({checkTypes: true, env: env.concat(IO.env)})

// cheerioIO :: String -> IO cheerio
const cheerioIO = body => S.of(IO)(cheerio.load(body))
// h2 :: cheerio -> HTML
const h2 = $ =>  $('h2').html()
// h3 :: cheerio -> HTML
const h3 = $ => $('h3').html()
// h4 :: cheerio -> HTML
const h4 = $ => $('h4').html()


const toEither = value => value ? S.Right(value) :  S.Left('Empty')

const toChar = n => n < 0 || n > 25
  ? S.Left(n + ' is out of bounds!')
  : S.Right(String.fromCharCode(n + 65))

const M = S.traverse(Array) ( x => [ toEither(h2(x)), toEither(h3(x)), toEither(h4(x)) ] ) (cheerioIO(code))
// const K = S.traverse (S.of(IO)) (x =>  S.of(IO)(x + 2)) ([1, 90])
const J = S.traverse (Array) (S.words ) (S.of (IO) ('hola a to'))
const L = S.traverse(S.Either) (toChar) ([ 1,2,3])

// const B = S.traverse ( S.Maybe ) (x => [S.Just(x)] ) ( S.of (IO) ('!') )
 
// v['fantasy-land/ap'](u['fantasy-land/ap'](a['fantasy-land/map'](f => g => x => f(g(x))))) 
// is equivalent to 
// v['fantasy-land/ap'](u)['fantasy-land/ap'](a) (composition)
const v = S.of(IO)(6)
const u = S.of(IO)(x => x + 122);
const a = S.of(IO)(x => x +1)
console.log(v.ap(u.ap(a.map(f => g => x => f(g(x))))).unsafePerformIO(), 'made a valir AP')
console.log(v.ap(u).ap(a).unsafePerformIO(), ' made a valid ap')

const getAnchor = t => S.pipe([
    S.map(S.map(x => x.trim())),
    S.map(S.map(x => x.replace(/\s/ig, '-'))),
])(t)

const extract = e => S.reduce (acc => x => x) ('paga') (e)

console.log(
    S.map (extract) ( S.map (x => x.unsafePerformIO()) (S.map( getAnchor ) (M)) )  
        //S.pipe( [ getAnchor, x => x.toString(), x => console.log(x) ] ) ) (M),
    
    // J,
    // S.map(x=> x.unsafePerformIO() ) (J),
    // L,
    // R.traverse(S.of(IO), x => S.of(IO) (x +3), [1,2,3]).unsafePerformIO()
    // // S.map(x => x.unsafePerformIO() ) (M), 
    // // K.unsafePerformIO(),
    // S.map( S.pipe( [ S.map(  S.map(getAnchor) ) , x => x.unsafePerformIO() ]) ) (J),
)
