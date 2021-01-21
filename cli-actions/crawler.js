// crawler
import IO from './../fp/monad/io'
import Tuple from './../fp/monad/tuple'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { fork, chain, encase, map, encaseP, resolve, parallel } from 'fluture'
import { log } from './../utils'
import sanctuary from 'sanctuary'
const $ = require('sanctuary-def')



const { load } = cheerio
const seed = 'http://www.tomharding.me/2017/06/19/fantas-eel-and-specification-17/'
const deepper = 2

const S = sanctuary.create ({
  checkTypes: true, 
  env: sanctuary.env.concat(IO.env).concat([
    Tuple.env ($.Unknown) ($.Unknown),
  ])
})

const validLink = ({hostname}) => x => isFullPath(hostname)(x) ||  isAbsolutePath(x)
const isAbsolutePath = x => x.substring(0,1) === '/'
const isFullPath = hostname => x => x.includes(hostname)

// href :: Cheerio -> HTML  
const href = $ => $('a')

// toArray :: Cheerio -> []
const toArray = $ => $.toArray()

// attr :: String -> Cheerio -> String
const attr = att => $ => $.attr(att)
const unique = x => [ ... new Set(x) ]
const form = ({origin}) => x => isFullPath(origin)(x) ? x :  S.concat (origin) (x)

const deep = count => seed => encaseP(fetch)(seed)
  .pipe(chain(encaseP(r => r.text())))
  .pipe(map( getLinks (new URL(seed)) ))

const getLinks = seed => dom => S.pipe([
  load,
  href,
  S.compose (S.map(cheerio)) (toArray),
  S.map(attr('href')),
  S.filter(validLink (new URL(seed)) ),
  unique,
  S.map( form(seed) )
]) (dom)


const proc = deep(0)(seed)


export const crawler = () => fork(log('error'))(log('response'))(proc)

