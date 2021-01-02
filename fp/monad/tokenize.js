// tokenize is
const daggy = require('daggy');
import { tokenize } from 'esprima';
import {KMPSearch} from './../../utils/algoritm/knuthmorrispratt';
import { prop, props, add, flatten, last, keys, curry, equals} from 'ramda';
import { getIndexValue } from './../../utils'
import S from 'sanctuary'
import fl from 'fantasy-land'

// getLineNumber :: String -> {} -> Int 
const getLineNumber = position => loc => prop('line', prop(position, loc));

// getColumnNumber :: String -> {} -> Int 
const getColumnNumber = position => loc => prop('column', prop(position, loc));

// getStartLineNumber :: {} -> Int
const getStartLineNumber = obj => getLineNumber('start')(obj);

// getEndLineNumber :: {} -> Int
const getEndLineNumber = obj => getLineNumber('end')(obj);

// getStartColumnNumber :: {} -> Int
const getStartColumnNumber = obj => getColumnNumber('start')(obj);


// getEndColumnNumber :: {} -> Int
const getEndColumnNumber = obj => getColumnNumber('end')(obj);


// getIdentifier :: String -> {} -> Boolean
const getIdentifier = pattern => obj => 
equals(props(['type', 'value'], obj), pattern);

const Tokenize = daggy.tagged('Tokenize', ['unsafePerformIO']);

// concat :: Semigroup a => a ~> a -> a
Tokenize.prototype[fl.concat] = Tokenize.prototype.concat = function(that) {
  return Tokenize(() => this.unsafePerformIO().concat(that.unsafePerformIO()))
}

// map :: f => ( a -> b) -> f b
Tokenize.prototype[fl.map] = Tokenize.prototype.map = function(f) {
    return Tokenize(() => f(this.unsafePerformIO()))
}

// filter :: f => [a] -> [a]
Tokenize.prototype.filterWithPattern = function(pattern) {
  return this.toPatternArray(pattern)
}

// toPatternArray :: tokenize a -> [b] -> tokenize [c] 
export const toPatternArray = arr => tokenize => tokenize.toPatternArray(arr)

Tokenize.prototype.toPatternArray = function(arr) {
  const pattern = arr.map(x => [...keys(x), prop(prop(0, keys(x)), x)])
  const KPMs =  this.map(S.map(curry(KMPSearch)(getIdentifier)(pattern)))

  const unifyElements = elms => [ ... new Set(flatten(elms)) ];
  const getLines = x => unifyElements(x.map(z => [
    add(getStartLineNumber(prop('loc', z)))(-1),
    add(getEndLineNumber(prop('loc', z)))(-1)
  ]))
  return KPMs.map(S.map(S.map(y =>({
    lines: getLines(y),
    start: {
      line: add(getStartLineNumber(prop('loc', prop(0, y))))(-1), 
      column: getStartColumnNumber(prop('loc', prop(0, y)))
    },
    end: { 
      line: add(getEndLineNumber(prop('loc', last(y))))(-1),
      column: getEndColumnNumber(prop('loc', last(y)))
    }
  }))))
}


// toArray :: () -> []
export const toArray = tokenize => tokenize.toArray()
Tokenize.prototype.toArray = function() {
  return S.reduce(S.concat)([])(this.unsafePerformIO())
}

// toMarkdown :: tokenize a => [ a ]-> [ String ] -> tokenize [ b ] 
export const toMarkdown = code => tokenize => tokenize.toMarkdown(code)
Tokenize.prototype.toMarkdown = function(code) {

  const insertNegrita = str => pos => {
    const arrStr = str.split('')
    arrStr.splice(pos, 0, '*')
    arrStr.splice(pos, 0, '*')
    return arrStr.join('');
  }

  const getLineMarkdown = pattern => x => {
    const str = getIndexValue(code)(x)
    const startStr = insertNegrita(str)(getStartColumnNumber(pattern))
    const endStr = insertNegrita(startStr)(add(getEndColumnNumber(pattern))(2))

    return endStr
  };
  const getLines = pattern => acc => x => `${acc}\n**line ${add(1)(x)}**:\t${getLineMarkdown(pattern)(x)}`;
  const getMarkdown = a => S.Right(S.map(
      x =>  S.reduce(getLines(x))('')(prop('lines', x))
  )(a))

  return this.map(x => S.isLeft(x) ?  S.map(S.map(x => `\n**[ERR]**\t${x}`))(S.Right(S.lefts([x]))) : S.chain(getMarkdown)(x))
}


export const Token = code => Tokenize(() => {
  try {
    return S.Right(tokenize(code, { comment: true, loc: true }))
  } catch(e) {
    return S.Left(e)
  }
});