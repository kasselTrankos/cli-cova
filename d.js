// d

import Reader from './fp/monad/reader'
import IO from './fp/monad/io'
import {fork, resolve, chain, reject, Future} from 'fluture'
import {listCollections} from './fp/monad/mongo'
import { log } from './utils'
import { prop, pipe, pipeK, map, compose } from 'ramda'
import S, { Either, reduce } from 'sanctuary'
const Z = require('sanctuary-type-classes')


const getProp = k => o => o[k]
const safeprop = k => o => o[k] ? S.Right(o[k]) : S.Left(`No existe esa ke y ${k}`)
const eitherToFuture = x => S.isRight(x) ? resolve(x) : reject(x)
 
const getName = pipeK(
    safeprop('0'),
    safeprop('namge'),
)


const p = pipe(
    getName,
    eitherToFuture,
)
const proc = Reader(map(x => S.fromEither('ERORR is anomalia')(x)))
    .map(chain(p))
    .runWith(listCollections ('crawl'))
fork (log('[ERR]')) (log('[OK]')) (proc)    