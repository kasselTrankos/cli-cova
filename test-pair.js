const {Pair, Task} = require('./fp/monad');
const lift2 = (f, a, b) => b.ap(a.map(f));
// monkey patch
Array.empty = () => [];
const DATA = [1,2,3];
const State = Pair(Array);
const I = x => x;
const toTask = x => console.log(x, '0000000000000') || State(x, Task.of(x));
const appends = x => xs => [x, ...xs];
const sequence = (T, xs) => xs.reduce((acc, x) => lift2(appends, Task.of(x),  acc), T.of([]));
const wheel = (T, dirs) => sequence(T, dirs.map(I));
// Array -> Pair -> Task ----- this is the way
const f = State.of(DATA);
const h = wheel(Task, f);
console.log(f, '000000');
h._2.fork(console.error, console.log);
console.log(h, '111111111111');
const j = f.chain(toTask);
console.log(j, '2222222222222222')
j._2.fork(console.error, console.log);
// Pair Array Task

