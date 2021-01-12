// html-cheerio
import S from 'sanctuary'
import Generator from './../../utils/generator'

const getAnchor = t => console.log(t, 'asdasdasdasd') || S.pipe([
    S.map(x => x.trim()),
    S.map(x => x.replaceAll(' ', '-'))
])(t)
const madeMenu = value => S.map ( S.map( getAnchor ) ) (value)
export const getDOM = ([content, menu]) => {
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
    </div>
    <div class="col-sm-9 offset-3">
      ${S.map ( S.map( x => console.log(getAnchor (x) ) || x ) ) (content)}\
    </div>
  </div>
</div>
</body>\
</html>`
}