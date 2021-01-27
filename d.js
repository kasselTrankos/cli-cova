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
import Reader from './fp/monad/reader'

const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat(env)})
const { pipe, Either, chain, map, ap } = S

// safeprop :: {} -> Either {} a
const safeprop = k => o => o[k] ? S.Right(o[k]) : S.Left(`No existe esa key ${k} in ${JSON.stringify(o)}`)

// eitherToFuture :: Either -> Future error a
const eitherToFuture = S.either (Future.reject) (Future.resolve)

// path :: String -> Object -> Either * String
const path = s => o => reduce((acc, x) => chain (safeprop(x)) (acc),  S.Right(o), s.split('.'))





const getCharacter = id =>
encaseP(fetch)(`https://www.breakingbadapi.com/api/characters/${id}`)
.pipe(Future.chain(encaseP(r => r.text())))

const getTable = ReaderT(Future)


// getTableName :: String -> Future e String
const getTable = pipe([
  listCollections,
  chain(pipe([
    path('0.name'),
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
fork (log('00000000')) (log('1111111111')) (proc('crawl'))