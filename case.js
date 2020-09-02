const { readdirSync, lstatSync } = require('fs');
const { RoseTree } = require('./fp/monad');
const { chain } = require('fantasy-land');
const pipe = (...fns) => x => fns.reduceRight((acc, fn)=> fn(acc) , x);

class Monad {
  constructor (a) {
    this.value = a;
  }
  // Applicative :: of f => a -> f a
  static of(a){
    return new Monad(a);
  }
  // Chain :: chain f a => a -> (a -> f b) -> f b 
  chain(f){
    return f(this.value);
  }
};

class Task {
  constructor (a) {
    this.value = a;
  }
  // Applicative :: of f => a -> f a
  static of(a){
    return new Task(a);
  }
  // Chain :: chain f a => a -> (a -> f b) -> f b 
  chain(f){
    return f(this.value);
  }
};

const i = Monad.of(1);
const d = RoseTree.of('./node_modules')
const c = i
  .chain(x => Monad.of(x + 12))
  .chain(v => Monad.of(v - 11));

// + :: getfiles String -> [String]
const getfiles = x => {
  try {
    console.log(x, '00000000000');
    return readdirSync(x);
  }catch(e){
    return [];
  }
}
// + :: map [] -> 
const map = f => xs => xs.map(f);
const filter = f => xs => xs.filter(f);
const addnode = x => `./node_modules/${x}`;

//+ :: toRoseTree String -> RoseTRee
const toRoseTree = d => x => push(RoseTree.of(addnode(`${x}`)));

const mapToRoseTree = x => map(toRoseTree(x));
const isDir = d => x => 
{
  try{
    return lstatSync(`${d}/${x}`).isDirectory()
  }catch(e){
    return false;
  }
};
const filterDir = x => filter(isDir(x));

const t = Task.of(23);
const prop = key => o => o[key];
const getNode = prop('node');
const readdir = pipe(
  getfiles,
  getNode
);
const getDirectories = d => pipe(
  mapToRoseTree(getNode(d)),
  filterDir(getNode(d)),
);

const push = d => d.concat(
  proc(d)
);

const proc = d => pipe(
  getDirectories(d),
  readdir
)(d);




const tm = push(d)
console.log( tm.node, JSON.stringify(tm))