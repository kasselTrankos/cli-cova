// d

import ReaderT from './fp/monad/readert'
import IO from './fp/monad/io'
import {fork, Future, encaseP, resolve, parallel} from 'fluture'
import fetch from 'node-fetch'
import {listCollections, find, insert} from './fp/monad/mongo'
import { log } from './utils'
import { env } from 'fluture-sanctuary-types'
import sanctuary  from 'sanctuary'
const Z = require('sanctuary-type-classes')
import { flatten, reduce } from 'ramda'
import { ask } from './utils/cli';
import cheerio from 'cheerio'
const $ = require ('sanctuary-def');
import Compare from './fp/monad/compare'

const Url = $.NullaryType
  ('Url')
  ('https://example.com/my-package#Url')
  ([])
  (x => Object.prototype.toString.call (x) === '[object URL]');

const S = sanctuary.create ({
  checkTypes: true, 
  env: sanctuary.env.concat(env).concat([Url])
})
const { pipe, Either, chain, map, filter } = S

const dbName = 'crawl'
const tbl = 'links'


// safeURL -> String -> {} -> Either {} String
const safeURL = x => {
  try {
    return S.Right(new URL(x))
  } catch (e) {
    return S.Left(' no es una URL válida ' + x)
  }
}

const prop = k => o => o[k]

// safeprop :: {} -> Either {} a
const safeprop = k => o => o[k] ? S.Right(o[k]) : S.Left(`No existe esa key ${k} in ${JSON.stringify(o)}`)

// eitherToFuture :: Either -> Future error a
const eitherToFuture = S.either (Future.reject) (Future.resolve)

// safepath :: String -> {} -> Either String *
const safepath = s => o => reduce((acc, x) => chain (safeprop(x)) (acc),  S.Right(o), s.split('.'))

// href :: Cheerio -> HTML  
const href = $ => $('a')

// toArray :: Cheerio -> []
const toArray = $ => $.toArray()

// attr :: String -> Cheerio -> String
const attr = att => $ => $.attr(att)

// unique -> [*] -> [*]
const unique = x => [ ... new Set(x) ]

// isFullPath :: String -> Boolean
const isFullPath = hostname => x => x.includes(hostname)

// isAbsolutePath :: String -> Boolean
const isAbsolutePath = x => x.substring(0,1) === '/'

// getHostname :: *
const getHostname = prop('hostname')

/// review names
const form = ({origin}) => x => isFullPath(origin)(x) ? x :  S.concat (origin) (x)

// not :: Boolean -> Boolean
const not = x => !x

// fullpath :: Compare
const fullpath = Compare((a, b)=> a.includes(b))
  .contramap(x => getHostname(x) || x)

// absolutepath :: Compare
const absolutepath = Compare(isAbsolutePath)

// mailto :: Compare
const mailto = Compare(x => not(/^mailto\:/.test(x)))

// javascript :: Compare
const javascript = Compare(x=> not(/^ĵavascript/.test(x)))

// validlink ::  URL ->  String -> Boolean
const validLink = url => x => fullpath.concat(absolutepath)
  .and(mailto)
  .and(javascript)
  .compare(x, url) 


// getLinks -> URL -> Strinh -> [ String ]
const getLinks = seed => pipe([
  cheerio.load,
  href,
  S.compose (map(cheerio)) (toArray),
  map(attr('href')),
  filter(validLink (seed) ),
  unique,
  S.map( form(seed) )
])
const load = x => encaseP(fetch)(x)
.pipe(Future.chain(encaseP(r => r.text())))


// safeload :: URL -> Furure e String
const safeload = pipe([
  safeprop('href'),
  eitherToFuture,
  chain(load),
])

// safefindlink :: String -> Future error [ String ]
const safefindlink = pipe([
  url => find(dbName) (tbl) ({url}),
  chain(pipe([
    safepath('0.links'),
    eitherToFuture,
  ])),
])

const loadlinks = x => chain (pipe([ getLinks(x), resolve]) ) (safeload(x))


// safeloadlinks :: String -> Future error [ String ]
const safeloadlinks = pipe([
  safeURL,
  eitherToFuture,
  chain(url =>  chain   (links => chain( ()=> S.of(Future) (links) )   (insert (dbName) (tbl) ({links, url: url.href}))    )  ( loadlinks(url) ))     ,
])

// obtainLinks:: String -> Future error [ String ]
const obtainLinks = pipe([
  a => S.alt (safeloadlinks(a)) (safefindlink(a))
])
const proc = pipe([
  ask,
  chain(pipe([
    safeURL,
    eitherToFuture,
  ])),
  chain(pipe([
    safeprop('href'),
    eitherToFuture,
  ])),
  chain(c => S.traverse (Future) (obtainLinks) ([c])),
  map( pipe( [ flatten,  unique ])),
  chain( S.traverse (Future) (obtainLinks)),
  map( pipe( [ flatten,  unique ])),
  chain( S.traverse (Future) (obtainLinks)),
  map( pipe( [ flatten,  unique ])),
])

fork (log('ERR')) (log('SUCCESS')) (proc('Give me a site: '))