// d

import ReaderT from './fp/monad/readert'
import IO from './fp/monad/io'
import {fork, Future, encaseP, resolve} from 'fluture'
import fetch from 'node-fetch'
import {listCollections, find} from './fp/monad/mongo'
import { log } from './utils'
import { env } from 'fluture-sanctuary-types'
import sanctuary from 'sanctuary'
import { json } from 'jsverify'
const Z = require('sanctuary-type-classes')

const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat(env)})
const { pipe, pipeK, of, Either, chain, map } = S

// safeprop :: {} -> Either {} a
const safeprop = k => o => o[k] ? S.Right(o[k]) : S.Left(`No existe esa key ${k} in ${JSON.stringify(o)}`)

// eitherToFuture :: Either -> Future error a
const eitherToFuture = S.either (Future.reject) (Future.resolve)


// getSafeName :: Either -> String String
const getSafeName = pipeK([
    safeprop('0'),
    safeprop('name'),
])


const proc = pipe([
  listCollections,
  chain(pipe([
    of(Either),
    getSafeName,
    eitherToFuture,
  ])),
  // chain(tbl => find('crawl')(tbl)({}))
])


const getCharacter = id => encaseP(fetch)(`https://www.breakingbadapi.com/api/characters/${id}`)
    .pipe(Future.chain(encaseP(r => r.text())))

const a = ReaderT(IO)
// const b = ReaderT(Either)

// const c = ReaderT(Future)
  // .map(listCollections)


log('0000')(a.runWith(9))
log('0000--')(a.runWith(9).unsafePerformIO())
log('-1111--')(a.map(x => x + 11).runWith(0).unsafePerformIO() )
log('-333--')(a.map(x => x + 11).map(x => x + 12).chain(x => IO.of(x + 899)).runWith(0).unsafePerformIO() )
// log('1111')(a.of(110).runWith().unsafePerformIO() )
// log('2222')(a.of(110).map(x => x +10).runWith().unsafePerformIO() )
// log('3333')(a.of(110).ap(IO.of(x => x + 210)).runWith().unsafePerformIO() )
// log('4444')(a.of(21).chain(x => IO.of(x + 210)).runWith().unsafePerformIO() )



// log('00')(b.runWith(90))
// log('11')(b.of(90).runWith())
// log('22')(b.of(9).map(x=> x +12).map(x => x +123).runWith())
// log('33') (b.of(12).ap(S.Right(x => x + 111)).runWith())
// log('44') (b.of(12).chain(x => S.Right(x + 111)).runWith())




// fork (log('[ERR]')) (log('[OK]')) (proc('crawl'))    


// fork (log('00000000')) (log('1111111111')) (c.runWith('crawl'))


const proc1 = pipe([
    getCharacter,
    map(x => JSON.parse(x)),
    chain(pipe([
        of(Either),
        getSafeName,
        eitherToFuture,
    ])),
])



fork (log('00000000')) (log('1111111111')) (proc1(1))