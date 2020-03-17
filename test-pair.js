const {Pair} = require('./fp/monad');
// monkey patch
Array.empty = () => [];
const p = Pair(Array);
const n = p.of(101).map(x => x + 10);
const j = n.chain(x => p([x], x + 1903))

console.log(n, j, '¡PAIR');

