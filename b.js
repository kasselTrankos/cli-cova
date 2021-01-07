// b

const Tuple = require('./fp/monad/tuple')
const IO = require('./fp/monad/io')
const Sum = require('./fp/monad/sum')
const Dom = require('./fp/monad/dom')
const $ = require('sanctuary-def')
const {create, env} = require ('sanctuary')
const cheerio = require('cheerio')

const { fork, encaseP, chain, map, parallel, resolve } =  require('fluture') 

import { writefile} from './utils/fs'
import fetch from 'node-fetch'

import { log } from './utils'

const link = 'http://www.tomharding.me/2017/06/12/fantas-eel-and-specification-16/';
const links = [
  'http://www.tomharding.me/2017/06/12/fantas-eel-and-specification-16/',
  'http://www.tomharding.me/2018/02/19/dependable-types-3/'];

const replaceWith = pattern => replacement => str => str.replace(pattern, replacement)


// replaceSpaceToMinium :: String -> String
const replaceSpaceToMinium = replaceWith(/\s/ig)('-')


// trim :: String -> String
const trim = x => x.trim()

const dom = '<h1>hola</h1><h2>hbye</h2>'
// const S = require('sanctuary')

// cheerioIO :: String -> IO cheerio
const cheerioIO = body => S.of(IO)(cheerio.load(body))

const h1 = $ => $('h1').html()
// h2 :: cheerio -> HTML
const h2 = $ =>  $('h2').html()
// h3 :: cheerio -> HTML
const h3 = $ => $('h3').html()
// h4 :: cheerio -> HTMLlinkMenu
const h4 = $ => $('h4').html()
const roleMain = $ => $('main[role=mmain]').html()


const getDOM = ({ fst, snd}) => {
  console.log(fst, snd)
  return `<html>\
  <head>\
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">\
<link href="http://www.tomharding.me/css/lanyon.css"  rel="stylesheet" crossorigin="anonymous">\
</head>\
<body>\
<div class="container-fluid">
<div class="row">
  <div class="col-sm-3 bg-light border-right align-self-start" style="kdfjlpadding:0; position: fixed; display: block;">
  ${ S.reduce (acc =>x =>x) ('')(fst)}
  </div>
  <div class="col-sm-9 offset-3">
    ${ S.reduce (acc =>x =>x) ('')(snd)}
  </div>
</div>
</div>
</body>\
</html>`
}



const S = create ({checkTypes: true, env: env.concat( [ 
  Dom.env ($.Unknown),
  Tuple.env ($.Unknown) ($.Unknown),
] )})

const linkName = x => `<a name="${x}"></a>`
const linkMenu = href => x => console.log(x, href, '12') || 
  `<a href="#${href}" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${x}</a>`


// const A = 
//   S.concat(Tuple( [1] ) (Sum(1))) (Tuple([1]) (Sum(1)))
//   // .concat (Tuple (S.Just ([1, 2, 3])) ([6]))
  // .bimap(x => x +2, x => x +4)
  // .both(x => x +3)



const extractIO = x => x.unsafePerformIO()

const maybe = x => x ? S.Just(x) : S.Nothing

const A = uri => dom => S.traverse(Tuple) ( S.map( x =>Tuple ( maybe(h1(x)) ) ( maybe(roleMain(x)) ) )) (Tuple (uri) (cheerioIO(dom)))
const C = x =>  S.reduce(acc => x => 
  S.concat(acc) ( x.snd.bimap 
    ( S.map(linkMenu(x.fst))) 
    (y => S.concat(S.map (linkName) (maybe (x.fst)) ) (y))
  ) ) 
( Tuple( S.Just('') ) ( S.Just('') ) ) (x)
//console.log('00000', x.fst, '..........') || S.reduce(acc => x => console.log(S.concat (acc) (x), '1111111, acc', acc) ||  S.concat (acc) (x) ) (Tuple(Dom('')) (Dom(''))) (x)

// [ Pair (menu) (content) ] -> Pair (menu) (content)
// dom  :: [ Pair (String, [ String ]) ] -> String12931292239123
 
const getHtmlBody = url => encaseP(fetch)(url)
  .pipe(chain(encaseP(r => r.text())))
  .pipe(map(A(url)))
  .pipe(map(extractIO))
  
const proc = parallel(Infinity) (links.map(getHtmlBody))
  .pipe(map( C ) )
  .pipe(map (getDOM))
  .pipe(chain(writefile('ret.html'))) 
  .pipe(map(() => ' please look ret.thml '))
fork (log('ERR')) (log ('OK')) (proc)


