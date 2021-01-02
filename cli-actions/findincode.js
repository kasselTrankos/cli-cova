//get-methods-name

import { ask } from './../utils/cli';
import { readDir, readfile, writefile, isdirectory, basename} from './../utils/fs';
import { getFileByExtension, filter,
  splitCodeLines, gotWhiteSpaces, ignoreByName, ignoreHidden, log } from './../utils'; 
import { flatten, compose } from 'ramda';
import Generator from './../utils/generator'
import { Token, toArray } from './../fp/monad/tokenize' 
import {fork, chain, bichain, reject, resolve, map, parallel} from 'fluture'
import S from 'sanctuary'

// getFilesInDir :: String -> [Array] -> Future a b
const getFilesInDir = files => resolve(files)
  .pipe(map(filter(ignoreByName('node_modules'))))
  .pipe(map(filter(compose(ignoreHidden, basename))))
  .pipe(chain(filteredFiles => 
    parallel(Infinity)(filteredFiles.map(isdirectory))
      .pipe(map(isDir => S.zip(isDir)(filteredFiles)))
      .pipe(chain(recurDir))
      .pipe(map(flatten))
  ))

// readDirs :: [Pair a b] -> Future e [ String ]
const recurDir = dir => parallel(Infinity)(dir.map( p =>
  S.fst(p) 
    ? readDir(S.extract(p)).pipe(chain(getFilesInDir))
    : resolve(S.extract(p))
))

// branchValid :: (a -> b) -> String -> * -> Future m *
const branchValid = f => m => x => f(x) ? reject(m) : resolve(x) 

// setDefaultFolderOnError :: a -> b -> Future c d -> Future a b
const setDefaultFolderOnError = defaultPath => path => isdirectory(path)
  .pipe(bichain(()=> resolve(defaultPath))(()=> resolve(path)))

// madeQuestionMaybe :: String -> Async e String
const madeAsk = q => ask(q)
  .pipe(chain(branchValid(gotWhiteSpaces)('Pattern can\'t contains spaces')))

// tokenize :: String -< [ String ] -> [ String ]
const tokenize = titles => Identifier => code =>{
  const inmutableTitles = Generator.of(titles)
  const inmutableCode = Generator.of(code)

  return S.pipe([
    S.map(Token),
    S.map(x => x.filterWithPattern([{ Identifier }])),
    S.map(x => x.toMarkdown(splitCodeLines(inmutableCode.next()))),
    S.map(toArray),
    S.map(x => {
      const title = inmutableTitles.next()

      return x.length ? `\n\n##${title}${x.join('')}` : ''
    }),
  ])(code)
} 

// getFiles :: String -> String -> [ String ] -> Future a b
const getFiles = path => pattern => files => 
  parallel(Infinity)(files.map(readfile))
 .pipe(map(tokenize(files)(pattern)))

// getListFiles :: String -> Future e [String]
const getListFiles = path => readDir(path)
  .pipe(chain(getFilesInDir))

// parse :: String -> [ String ] -> Future e [String] 
const parse = path => pattern => getListFiles(path)
  .pipe(map(S.filter(getFileByExtension('js'))))
  .pipe(chain(getFilesInDir))
  .pipe(chain(getFiles(path)(pattern)))

// findPattern :: String -> Future e a
const findPattern = path => ask('Give me a pattern: ')
  .pipe(chain(branchValid(gotWhiteSpaces)('Pattern can\'t contains spaces')))
  .pipe(chain(x => parse(path)(x)))
  .pipe(map(x => `#(${path})\n\n${x.join('')}`))
  
// saveMarkdown :: String -> Future a b -> Future a b
const saveMarkdonw = markdown => ask('name file: ')
  .pipe(chain(filename => writefile(`${filename}.md`)(markdown)))
  .pipe(map(x=> ' File saved !!'))

const proc = madeAsk('Give a path: ')
  .pipe(chain(setDefaultFolderOnError('.')))
  .pipe(chain(findPattern))
  .pipe(chain(saveMarkdonw))

  export const findinfiles = () => fork(log('error'))(log('response'))(proc)