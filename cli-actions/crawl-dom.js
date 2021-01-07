import { ask } from './../utils/cli'
import { fork, encaseP, parallel } from 'fluture'
import { log } from './../utils'
import sanctuary from 'sanctuary'
import { writefile } from './../utils/fs'
import { env } from 'fluture-sanctuary-types'
import { html, linkName, linkMenu } from './../fp/monad/html'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import IO from './../fp/monad/io'
import Ora from 'ora' 
import Tuple from './../fp/monad/tuple'
import { procCrawler } from './crawler'
const $ = require('sanctuary-def')


const S = sanctuary.create ({checkTypes: true, env: 
  sanctuary.env.concat(env).concat(IO.env).concat( [ 
  Tuple.env ($.Unknown) ($.Unknown),
] )})

const { pipe, chain, map } = S

// cheerioIO :: String -> IO cheerio
const cheerioIO = body => S.of (IO) (cheerio.load(body));

// extractIO :: IO * -> *
const extractIO = x => x.unsafePerformIO()

// h1 :: Cheerio -> HTML  
const h1 = $ => $('h1').html()

// select :: String -> Cheerio -> HTML  
const select = path => $ => $(path).html()

// maybe :: * -> Just | Nothing
const maybe = x => x ? S.Just(x) : S.Nothing

// getDOM :: String -> String -> String -> IO [ Tuple ( String, Tuple ( String, String)) ]
const getDom = selector => url => dom => 
  S.traverse(Tuple) ( S.map( x => Tuple ( maybe(h1(x)) ) ( maybe( select (selector) (x) ) ) )) (Tuple (url) (cheerioIO(dom)))

// getHtml :: [  Tuple ( String, Tuple ( String, String))] -> Tuple ( String, String )
const getHtml = x =>  S.reduce(acc => x => 
  S.concat(acc) (x.snd.bimap 
    ( S.map( linkMenu(x.fst) ) ) 
    (y => S.concat(S.map (linkName) (maybe (x.fst)) ) (y))
  ) )
( Tuple( S.Nothing ) ( S.Nothing ) ) (x)
  
const spinner = new Ora({
  discardStdin: false,
  text: 'Wait please',
  spinner: 'growVertical'
});
  
  const f = x  => {
    spinner.start()
    return x
  }
  const g = x => {
    spinner.stop()
    return x
  }
  

// scrappContent :: String -> String -> [ Tuple (String, Tuple ( String, String) ) ]
const scrappContent = selector => url => encaseP(fetch)(url)
  .pipe(chain(encaseP(r => r.text())))
  .pipe(map( getDom (selector) (url) ))
  .pipe(map(extractIO))

const proc = pipe([
  procCrawler,
  pipe([
    chain(uris => 
      ask('Give me a selector: ')
      .pipe(map(f))
      .pipe(chain(x => parallel (Infinity) (S.map (scrappContent(x) ) (uris) )))
  )]),
  map(getHtml),
  map(html),
  chain(writefile('result.html')),
  map(g),
  map(_ => 'please look at result file')
])

export const crawlDom = () => fork(log('error'))(log('response'))(proc('Give me a site: '))