// html-cheerio
import S from 'sanctuary'


export const linkName = x => `<a name="${x}"></a>`
export const linkMenu = href => x =>
  `<a href="#${href}" class="list-group-item list-group-item-action bg-light col-2 text-truncate" style="font-size: 0.75rem;">${x}</a>`


export const html =  ({ fst, snd}) => {
  return `<html>\
    <head>\
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">\
    <link href="http://www.tomharding.me/css/lanyon.css"  rel="stylesheet" crossorigin="anonymous">\
    </head>\
    <body>\
    <div class="container-fluid">
    <div class="row">
      <div class="col-sm-3 bg-light border-right align-self-start" style="kdfjlpadding:0; position: absolute; display: block;">
      ${ S.reduce (acc =>x =>x) ('')(fst)}
      </div>
      <div class="col-sm-9 offset-3">
        ${ S.reduce (acc =>x =>x) ('')(snd)}
      </div>
      </div>
    </div>
    </div>
  </body>\
</html>`
}
