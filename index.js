const {Task} = require('./fp/monad');
const {readdir} = require('fs');
const {pipe, map, lift, chain, ap} = require('ramda');
const lift2 =(f, a, b) => b.ap(a.map(f))

const ReaderTask = dir => new Task((reject, resolve)=> {
  readdir(dir, function(err, list) {
    return err ? reject(err) : resolve(list);
  });
});
const append = x => xs => [x, ...xs];


const path = x => `./node_modules/${x}/dist`;

const toUpperCase = v => v.toUpperCase();
const redus = xs => xs.reduce((acc, x)=> lift2(append, Task.of(x), ReaderTask(path(x)), acc), Task.of([]))

const program = pipe(
  ReaderTask,
  chain(redus),
  map(x=> x.flatMap(x=> x))
  
);

const h = program('./node_modules')
  .fork(c => console.error('00d0dd', c), (data) => console.log('0das0dassad', data));