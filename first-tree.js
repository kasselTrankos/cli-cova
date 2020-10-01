const { readdirSync, lstatSync } = require('fs');
const daggy = require('daggy');
const { RoseTree, Maybe } = require('./fp/monad');
const { chain } = require('fantasy-land');
const {Just, Nothing} = Maybe;
const { ONCE, B, PAIR } = require('./lambda');
const { toLower } = require('sanctuary');


const pipe = (...fns) => x => fns.reduceRight((acc, fn)=> fn(acc) , x);
const Alt = x =>
({
  x,
  concat: o => Alt(x.alt(o.x))
});
const t = RoseTree.empty();
// console.log(RoseTree.of(0).concat(RoseTree.empty()))

const origin = RoseTree.of('/home/vera/irrigation-native');
// console.log(daggy);
// + :: getfiles String -> [String]
const getfiles = x => {

  try {
    return readdirSync(x).map(y => `${x}/${y}`);
  }catch(e){
    return [];
  }
}

const append = a => b => a.append(b);
// + :: map [] -> 
const map = f => xs => xs.map(f);
// + :: filter f a => a ~> (a -> b) -> b
const filter = f => xs => xs.filter(f);

const I = x => x;

const isDir = x => 
{
  try{
    return lstatSync(`${x}`).isDirectory();
  } catch(e){
    return false;
  }
};
const A = d => append(d)(proc(d));
const prop = key => o => o[key];
const getNode = prop('node');
const toRoseTree = x => RoseTree.of(`${x}`);

const proc = pipe( 
  map(B(A)(toRoseTree)),
  filter(isDir),
  getfiles,
  I,
  getNode,
);
    


const data =A(origin);
console.log( JSON.stringify(data))