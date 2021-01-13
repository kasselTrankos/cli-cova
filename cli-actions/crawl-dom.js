import { ask } from './../utils/cli'
import { fork, chain, encase, map, encaseP, resolve, ap, parallel } from 'fluture'
import { log, toJSON } from './../utils'
import { URL } from 'url'
import { checknmap, getsitemap } from './../utils/scaner'
import sanctuary from 'sanctuary'
import { writefile, readfile } from './../utils/fs'
import { env } from 'fluture-sanctuary-types'
import { getDOM } from './../fp/monad/html'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import IO from './../fp/monad/io'
const S = sanctuary.create({ checkTypes: true, env: sanctuary.env.concat(env).concat(IO.env) });
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


const toHTML = title => content => `<div class="container">\
  <h5>\
    <a href="${title}" class="text-primary">${title}</a>
  </h5>\
  ${content}</div>`




const getSelectors = readfile('dom.json')
  .pipe(map(toJSON))

// getHtmlBody :: String -> Pair(String, html)
const getHtmlBody = url => encaseP(fetch)(url)
  .pipe(chain(encaseP(r => r.text())))


// getBody :: Cheerio -> HTML  
const getBody = $ => $('article.post').html()

// getMenu :: Cheerio -> HTML  
const getMenu = $ => $('title').html()

const toEither = value => value ? S.Right(value) :  S.Left('Empty')


// getSitemap :: String -> Future e [ String ]
const getSitemap = url => resolve(url)
  .pipe(chain(encase(safeprop('origin'))))
  .pipe(chain(x => getsitemap(x)))


const proc = ask('Give me a site: ')
  .pipe(chain(encase(getURL)))
  .pipe(chain(getSitemap))
  .pipe(chain(x => parallel(Infinity)(x.map(getHtmlBody))))
  .pipe(map( S.map( c => S.traverse (Array) (x => [ toEither(getBody(x)), toEither( getMenu(x)) ]) (cheerioIO(c)) ) ))
  .pipe(map(S.reduce (acc => ([body, menu]) => [ [...acc[0], body], [ ...acc[1], menu]] ) ([[], []]) ))
  // .pipe(map(x => console.log(x, '111111111') || S.traverse(Array) (x => [ getBody(x), getMenu(x)]) (cheerioIO(x)) ))
  .pipe(map(x => getDOM(x)))
  // .pipe(map(x => getDOM (x.map(getMenu)) (x.map(getBody)) ))
  .pipe(chain(writefile('ret.html'))) 
  .pipe(map(() => ' MADE FILE '))

export const crawlDom = () => fork(log('error'))(log('response'))(proc)