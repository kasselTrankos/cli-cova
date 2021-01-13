// html-cheerio
import S from 'sanctuary'
import Generator from './../../utils/generator'

const getAnchor = t => S.pipe([
  S.map(x => x.trim()),
  S.map(x => x.replace(/\s/ig, '-')),
])(t)

const getLink = x => S.pipe([
  S.map(S.map( x => x.trim() )),
  S.map( S.map (x => `<a href="#cial" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${x}</a>` ) )
])(x)

const extract = e => S.reduce (acc=> x => x) ('nada') (e)

const madeMenu = value => S.map ( S.map( getAnchor ) ) (value)
// menu.map(l => `<a href="#${getAnchor(safeTitle(l))}" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${l}~</a>`).join('')
// ${S.map(l => `<a href="#${l}" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${l}~</a>` ) (S.map(extract) (S.map(x => x.unsafePerformIO()) ( S.map(getAnchor) (menu) )) )}
export const getDOM = ([body, menu]) => {
  console.log(menu.length, '0')
    const href = Generator.of(menu)
    return `<html>\
<head>\
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">\
  <link href="http://www.tomharding.me/css/lanyon.css"  rel="stylesheet" crossorigin="anonymous">\
</head>\
<body>\
<div class="container-fluid">
  <div class="row">
    <div class="col-sm-3 bg-light border-right align-self-start" style="padding:0; position: fixed; display: block;">
      ${ S.map (extract) ( S.map(x => x.unsafePerformIO()) ( S.map(getLink) (menu) ) ).join('') }
    </div>
    <div class="col-sm-9 offset-3">
      ${ S.map (extract) (S.map ( x => x.unsafePerformIO() ) (body) ).join( 'kdfjl')}
    </div>
  </div>
</div>
</body>\
</html>`
}