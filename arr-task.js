const {Task, Maybe} = require('./fp/monad');
const {tagged, taggedSum} = require('daggy');
const DIRS = ['./node_modules', '/Users/aotn', '/Users/aotn/GEMA/components'];
const appends = x => xs => console.log(x, '0000000000') || [x, ...xs];
const lift2 = (f, a, b) => b.ap(a.map(f));
const traverse = (xs, T) => xs.reduce((acc, x) => lift2(appends, T.of(x), acc), T.of([]));

const m = traverse(DIRS, Task);
m.fork(console.error, console.log)
console.log(m)