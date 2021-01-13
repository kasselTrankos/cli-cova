// html-cheerio
import S from 'sanctuary'
import Generator from './../../utils/generator'

const getAnchor = t => S.pipe([
  S.map(x => x.trim()),
  S.map(x => x.replace(/\s/ig, '-')),
  S.map(x => `<a name="${x}"></a>`)
])(t)

const getLink = x => S.pipe([
  S.map(S.map( x => x.trim() )),
  S.map( S.map (x => `<a href="#${x.replace(/\s/ig, '-')}" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${x}</a>` ) )
])(x)

const link = e => extract(S.map(getAnchor) (e).unsafePerformIO()) 
const extract = e => S.reduce (acc=> x => x) ('') (e)
export const getDOM = ([body, menu]) => {
    const href = Generator.of(menu)
    // console.log(link(href.next()), 'no loes')
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
        x => x.unsafePerformIO(),
        extract
      ])) (menu) .join('') }
    </div>
    <div class="col-sm-9 offset-3">
      ${ S.map ( S.pipe([
        x => x.unsafePerformIO(),
        x => extract(x),
        x => `${link(href.next())}${x}`
      ])) (body).join( '<hr7>')}
    </div>
  </div>
</div>
</body>\
</html>`
}