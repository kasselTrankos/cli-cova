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

const Url = $.NullaryType
  ('Url')
  ('https://example.com/my-package#Url')
  ([])
  (x => Object.prototype.toString.call (x) === '[object URL]');

const S = sanctuary.create ({
    checkTypes: true, 
    env: sanctuary.env.concat(env).concat([Url])})
const { pipe, Either, chain, map, ap, pipeK, filter } = S

// safeURL -> String -> {} -> Either {} String
const safeURL = x => {
    try {
      return S.Right(new URL(x))
    } catch (e) {
      return S.Left(' no es una URL válida ' + x)
    }
  }



// safeprop :: {} -> Either {} a
const safeprop = k => o => o[k] ? S.Right(o[k]) : S.Left(`No existe esa key ${k} in ${JSON.stringify(o)}`)

// eitherToFuture :: Either -> Future error a
const eitherToFuture = S.either (Future.reject) (Future.resolve)

// safepath :: String -> {} -> Either String *
const safepath = s => o => reduce((acc, x) => chain (safeprop(x)) (acc),  S.Right(o), s.split('.'))





const getCharacter = id => encaseP(fetch)(`https://www.breakingbadapi.com/api/characters/${id}`)
.pipe(Future.chain(encaseP(r => r.text())))


// getTableName :: String -> Future e String
const getTableName = pipe([
  listCollections,
  chain(pipe([
    safepath('0.name'),
    eitherToFuture,
  ])),
])
const proc = pipe([
  S.of(Future),
  chain(a => chain (b => find (a) (b) ({})) (getTableName(a)))
  //   a =>  S.lift2(x => y => `[${x}] + ${y}`)  
  //     (resolve(a))
  //     (getTable(a))
])
const isAbsolutePath = x => x.substring(0,1) === '/'
const isFullPath = hostname => x => x.includes(hostname)

// href :: Cheerio -> HTML  
const href = $ => $('a')

// toArray :: Cheerio -> []
const toArray = $ => $.toArray()
// attr :: String -> Cheerio -> String
const attr = att => $ => $.attr(att)
// unique -> [*] -> [*]
const unique = x => [ ... new Set(x) ]
//

const dbName = 'crawl'
const tbl = 'links'
const allLinks = safeprop('0.links')

// const obtainLink = x => console.log(x[0].links, 'lousos') || 
//   x[0].links ? S.Right([...x[0].links, x[0].url]) : S.Left([])

// const findLinks = x => S.reduce(acc => x => S.concat (acc) (obtainLink(x))) (S.Just([])) (x)


const links = pipe([
  flatten,
  S.reduce(acc => x => S.concat(acc)(x.links)) ([]),
  unique,
  S.of(Future),
])

const form = ({origin}) => x => isFullPath(origin)(x) ? x :  S.concat (origin) (x)
const validLink = ({hostname}) => x => isFullPath(hostname)(x) ||  isAbsolutePath(x)
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

const safeload = pipe([
  safeprop('href'),
  eitherToFuture,
  chain(load),
])

const findlink = x =>  find(dbName)(tbl)({url: x})

// safefindlink :: String -> Future error [ String ]
const safefindlink = pipe([
  findlink,
  chain(pipe([
    safepath('0.links'),
    eitherToFuture,
  ])),
])

const loadlinks = x => chain (pipe([ getLinks(x), resolve]) ) (safeload(x))
const insertlinks = pipeK([
  loadlinks,
  // links => chain( chain (S.of(Future) (links) ) (insert(dbName) (tbl) (links)) ) (links)
])

// safeloadlinks :: String -> Future error [ String ]
const safeloadlinks = pipe([
  safeURL,
  eitherToFuture,
  chain(url =>  chain   (links => chain( ()=> S.of(Future) (links) )   (insert (dbName) (tbl) ({links, url: url.href}))    )  ( loadlinks(url) ))     ,
])

const obtainLinks = pipe([
  a => S.alt (safeloadlinks(a)) (safefindlink(a))
])
const proc1 = pipe([
    ask,
    chain(pipe([
      safeURL,
      eitherToFuture,
    ])),
    chain(pipe([
      safeprop('href'),
      eitherToFuture,

    ])),
    // eitherToFuture,
    // map(x => console.log(x, 'zero') || x)
    chain(c => S.traverse (Future) (obtainLinks) ([c])),
    map( pipe( [ flatten,  unique ])),
    chain( S.traverse (Future) (obtainLinks)),
    map( pipe( [ flatten,  unique ])),
    chain( S.traverse (Future) (obtainLinks)),
    map( pipe( [ flatten,  unique ])),
    // chain(a => chain (Future.resolve (getLinks(a)) ) (load(a) )),
    // chain(eitherToFuture)
])
// https://miqueridowatson.com
fork (log('00000000')) (log('222222')) (proc1(' dame algo'))
// fork (log('00000000')) (log('222222')) (proc1(resolve('https://miqueridowatson.com/post-work/sorteos-once/')))