import { ask } from './../utils/cli'
import { fork, chain, encase, map, encaseP, resolve, ap, parallel } from 'fluture'
import { log, stringify } from './../utils'
import {URL} from 'url'
import { checknmap, getsitemap } from './../utils/scaner'
import sanctuary from 'sanctuary'
import { writefile} from './../utils/fs'
import {env} from 'fluture-sanctuary-types'
import {htmlIO} from './../fp/monad/html' 
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import IO from './../fp/monad/io'
const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (env)});


// cheerioIO :: String -> IO cheerio
const cheerioIO = body => IO.of(()=> cheerio.load(body));

// getURL -> String -> {} -> Throwing e *
const getURL = x =>  {
  try {
    return new URL(x)
  } catch(e) {
      throw e
  }
}

const combine = a => b => [a, b]

// safeprop -> String -> {} -> Throwing e *
const safeprop = k => o => {
  if(o[k]) {
    return o[k] 
  }
  throw `no existe la prop ${k} en ${o}`
}

const addhtml = x => `<html>\
  <head>\
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">\
    <link href="http://www.tomharding.me/css/lanyon.css"  rel="stylesheet" crossorigin="anonymous">\
  </head>\
  <body class="d-flex flex-column h-100">${x}</body>\
</html>`
const toHTML = title => content => `<div class="container">\
  <h5>\
    <a href="${title}" class="text-primary">${title}</a>
  </h5>\
  ${content}</div>`

const getSnippets = url => encaseP (fetch) (url)
  .pipe(chain(encaseP(r => r.text())))
  .pipe(map(cheerioIO))
  .pipe(map(S.map( $ => $('article.post').html() )))
  // .pipe(map(x => x.html('article.post')))
  .pipe(map(x => x.unsafePerformIO()))
  .pipe(map(toHTML(url)))

// getPorts :: {} -> Future e a
const getPorts = url => resolve(url)
.pipe(chain(encase(safeprop('host'))))
.pipe(chain(checknmap))

// getPorts :: {} -> Future e agetSitemap
const getSitemap = url => resolve(url)
  .pipe(chain(encase(safeprop('origin'))))
  .pipe(chain(x => getsitemap(x)
    .pipe(chain(y => parallel(Infinity)(y.map(getSnippets))))
  ))
  .pipe(map(x => x.join('<hr />')))
  .pipe(map(addhtml))



const proc = ask('Give me a site: ')
  .pipe(chain(encase (getURL)))
  .pipe(chain(getSitemap))
    // .pipe(ap(getPorts(url))) no need the ports here
    // .pipe(ap(getSitemap(url)))
  // ))
  // .pipe(map(stringify))
  .pipe(chain(writefile('mas.html')))
  .pipe(map(x =>' YAAA '))

export const scanPorts = () => fork(log('error'))(log('response'))(proc)