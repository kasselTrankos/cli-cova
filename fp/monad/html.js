// html-cheerio
import S from 'sanctuary'
import Generator from './../../utils/generator'

const replaceWith = pattern => replacement => str => str.replace(pattern, replacement)


// replaceSpaceToMinium :: String -> String
const replaceSpaceToMinium = replaceWith(/\s/ig)('-')


// trim :: String -> String
const trim = x => x.trim()

const extractIO = x => x.unsafePerformIO()

const getAnchor = t => S.pipe([
  S.map(trim),
  S.map(replaceSpaceToMinium),
  S.map(x => `<a name="${x}"></a>`)
])(t)

const getLink = x => S.pipe([
  S.map(S.map( trim )),
  S.map( S.map (x => `<a href="#${replaceSpaceToMinium(x)}" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${x}</a>` ) )
])(x)

const link = e => extract(S.map(getAnchor) (e).unsafePerformIO()) 
const extract = e => S.reduce (acc=> x => x) ('') (e)
export const getDOM = ([body, menu]) => {
    const href = Generator.of(menu)
    return `<html>\
<head>\
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">\
  <link href="http://www.tomharding.me/css/lanyon.css"  rel="stylesheet" crossorigin="anonymous">\
</head>\
<body>\
<div class="container-fluid">
  <div class="row">
    <div class="col-sm-3 bg-light border-right align-self-start" style="kdfjlpadding:0; position: fixed; display: block;">
      ${ S.map ( S.pipe([
        getLink,
        extractIO,
        extract
      ])) (menu) .join('') }
    </div>
    <div class="col-sm-9 offset-3">
      ${ S.map ( S.pipe([
        extractIO,
        x => extract(x),
        x => `${link(href.next())}${x}`
      ])) (body).join( '<hr7>')}
    </div>
  </div>
</div>
</body>\
</html>`
}