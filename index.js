const {Task} = require('./fp/monad');
const {readdir} = require('fs');
const {pipe, map, chain, ap} = require('ramda');
const lift2 =(f, a, b, c) => c.ap(b.ap(a.map(f)))

const ReaderTask = dir => new Task((reject, resolve)=> {
  readdir(dir, function(err, list) {
    return err ? reject(err) : resolve(list);
  });
});
const append = x => y => xs => [x, y, ...xs];


const path = x => `/home/vera/Documentos/${x}/fp`;

// aqui va la recusividad
const redus = xs => xs.reduce((acc, x)=> lift2(append, Task.of(x), ReaderTask(path(x)), acc), Task.of([]))

const program = pipe(
  ReaderTask,
  chain(redus),
  // map(x=> x.flatMap(x=> x))
  
);

const h = program('/home/vera/Documentos')
  .fork(c => console.error('00d0dd', c), (data) => console.log('0das0dassad', data));