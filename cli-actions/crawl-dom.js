import { ask } from './../utils/cli'
import { fork, chain, encase, map, encaseP, resolve, parallel } from 'fluture'
import { log } from './../utils'
import { URL } from 'url'
import { getsitemap } from './../utils/scaner'
import sanctuary from 'sanctuary'
import { writefile } from './../utils/fs'
import { env } from 'fluture-sanctuary-types'
import { html, linkName, linkMenu } from './../fp/monad/html'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import IO from './../fp/monad/io'
import Ora from 'ora' 
import Tuple from './../fp/monad/tuple'
const $ = require('sanctuary-def')


const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat(env).concat(IO.env).concat( [ 
  // Dom.env ($.String),
  // IO.env,
  // env,
  Tuple.env ($.Unknown) ($.Unknown),
] )})


// cheerioIO :: String -> IO cheerio
const cheerioIO = body => S.of (IO) (cheerio.load(body));

// getURL -> String -> {} -> Throwing e *
const getURL = x => {
  try {
    return new URL(x)
  } catch (e) {
    throw e
  }
}

// safeprop -> String -> {} -> Throwing e *
const safeprop = k => o => {
  if (o[k]) {
    return o[k]
  }
  throw `no existe la prop ${k} en ${o}`
}

// extractIO :: IO * -> *
const extractIO = x => x.unsafePerformIO()

// h1 :: Cheerio -> HTML  
const h1 = $ => $('h1').html()

// roleMain :: Cheerio -> HTML  
const roleMain = $ => $('main[role=main]').html()

// maybe :: * -> Just | Nothing
const maybe = x => x ? S.Just(x) : S.Nothing

// getDOM :: String -> String -> IO [ Tuple ( String, Tuple ( String, String)) ]
const getDom = uri => dom => S.traverse(Tuple) ( S.map( x => Tuple ( maybe(h1(x)) ) ( maybe(roleMain(x)) ) )) (Tuple (uri) (cheerioIO(dom)))

// getHtml :: [  Tuple ( String, Tuple ( String, String))] -> Tuple ( String, String )
const getHtml = x =>  S.reduce(acc => x => 
  S.concat(acc) (x.snd.bimap 
    ( S.map( linkMenu(x.fst) ) ) 
    (y => S.concat(S.map (linkName) (maybe (x.fst)) ) (y))
  ) )
( Tuple( S.Nothing ) ( S.Nothing ) ) (x)
  
  
  
// getSitemap :: String -> Future e [ String ]
const getSitemap = url => resolve(url)
  .pipe(chain(encase(safeprop('origin'))))
  .pipe(chain(x => getsitemap(x)))
  
const spinner = new Ora({
  discardStdin: false,
  text: 'Wait please',
  spinner: 'growVertical'
});
  
  const f = x  => {
    spinner.start()
    return x
  }
  const g = ()=> spinner.stop()
  

// scrapperContent :: String -> [ Tuple (String, Tuple ( String, String) ) ]
const scrapperContent = url => encaseP(fetch)(url)
  .pipe(chain(encaseP(r => r.text())))
  .pipe(map(getDom(url)))
  .pipe(map(extractIO))

const proc = ask('Give me a site: ')
  .pipe(map(f))
  .pipe(chain(encase(getURL)))
  .pipe(chain(getSitemap))
  .pipe(chain(x => parallel(Infinity)(x.map(scrapperContent))))
  .pipe(map(getHtml))
  .pipe(map(html))
  .pipe(chain(writefile('ret.html'))) 
  .pipe(map(g))
  .pipe(map(() => ' please look ret.thml '))

export const crawlDom = () => fork(log('error'))(log('response'))(proc)