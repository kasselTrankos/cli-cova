const {Task} = require('./fp/monad');
const {readdir} = require('fs');
const {pipe, map, lift, chain} = require('ramda');
const lift2 =(f, a, b) => console.log(f, a, b) ||  a.ap(b.map(f))

const ReaderTask = dir => console.log(dir, '1231234234') ||  new Task((reject, resolve)=> {
  readdir(dir, function(err, list) {
    return err ? reject(err) : resolve(list);
  });
});
const append = x => xs => console.log(x, '0123213') || [x, ...xs];


const path = x => `./node_modules/${x}/node_modules`;
const insideOut = (T, xs) => console.log(xs) ||  xs.reduce(
  (acc, x) => lift2(append, ReaderTask(path(x)), acc), T.of([]));

const paralellize = users =>
insideOut(Task, users.map(API.getById))
const toUpperCase = v => v.toUpperCase();
const concat = xs => insideOut(Task, xs)

const program = pipe(
  ReaderTask,
  // map(map(toUpperCase))
  chain(concat)
);

program('./node_modules')
  .fork(c => console.error('00d0dd', c), (data) => console.log('0das0dassad', data));