const {Task} = require('./fp/monad');
const {readdir} = require('fs');
const {pipe, map, lift} = require('ramda');

const ReaderTask = dir => new Task((reject, resolve)=> {
  readdir(dir, function(err, list) {
    return err ? reject(err) : resolve(list);
  });
});
const append = x => xs => [x, ...xs];


const insideOut = (T, xs) => xs.reduce(
  (acc, x) => lift(append, x, acc),
  T.of([]))

const paralellize = users =>
insideOut(Task, users.map(API.getById))
const toUpperCase = v => v.toUpperCase();
const concat = path => insideOut(Task,  path.map(x => x));

const program = pipe(
  ReaderTask,
  map(map(toUpperCase)),
  map(concat)
);

program('./node_modules')
  .fork(console.log, (data) => console.log(data) );