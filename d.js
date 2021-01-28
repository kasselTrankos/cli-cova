// d

import ReaderT from './fp/monad/readert'
import IO from './fp/monad/io'
import {fork, Future, encaseP, resolve} from 'fluture'
import fetch from 'node-fetch'
import {listCollections, find} from './fp/monad/mongo'
import { log } from './utils'
import { env } from 'fluture-sanctuary-types'
import sanctuary, { prop } from 'sanctuary'
const Z = require('sanctuary-type-classes')
import { reduce } from 'ramda'
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


const load = ({href}) => encaseP(fetch)(href)
    .pipe(Future.chain(encaseP(r => r.text())))



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
const validLink = ({hostname}) => x => isFullPath(hostname)(x) ||  isAbsolutePath(x)
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
const form = ({origin}) => x => isFullPath(origin)(x) ? x :  S.concat (origin) (x)

const getLinks = seed => pipe([
    cheerio.load,
    href,
    S.compose (map(cheerio)) (toArray),
    map(attr('href')),
    filter(validLink (seed) ),
    unique,
    S.map( form(seed) )
])

const proc1 = pipe([
    ask,
    chain(pipe([
        safeURL,
        eitherToFuture,
        map(x => console.log(x) || x)
    ])),
    chain(x => chain (a => Future.resolve(getLinks(x)(a))) (load(x)))
    // chain(a => chain (Future.resolve (getLinks(a)) ) (load(a) )),
    // chain(eitherToFuture)
])

// fork (log('00000000')) (log('1111111111')) (proc('crawl'))
fork (log('00000000')) (log('222222')) (proc1('Give me a site: '))
