// html-cheerio
import S from 'sanctuary'
import Generator from './../../utils/generator'

const safeTitle = value => value ? S.Right(value) : S.Left(' no hay menu') 
const getAnchor = t => S.pipe([
    S.map(x => x.trim()),
    S.map(x => x.replaceAll(' ', '-'))
])(t)
 
export const getDOM = menu => content => {
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
    ${menu.map(l => `<a href="#${getAnchor(safeTitle(l))}" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${l}~</a>`).join('')}
    </div>
    <div class="col-sm-9 offset-3">
      ${content.map(x => `<a name="${
          getAnchor(safeTitle(href.next()))
    }"></a>${x}`).join('<hr/>')}\
    </div>
  </div>
</div>
</body>\
</html>`
}