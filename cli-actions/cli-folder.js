// read files cli
import { getFromList, ask } from './../utils/cli';
import { prop, compose } from  'ramda';
import { getFileByExtension, toJSON, stringify, gotWhiteSpaces, log } from './../utils'; 
import { readdir,  readfile, writefile, isdirectory} from './../utils/fs';
import { chain, reject, resolve, bichain, fork, map, encase } from 'fluture';
import S from 'sanctuary'

// isEmpty :: [*] -> Bool
const isEmpty = x => x.lenght > 0

// setDefaultFolderOnError :: a -> b -> Future c d -> Future a b
const setDefaultFolderOnError = _defaultPath => path => isdirectory(path)
  .pipe(bichain(()=> resolve(_defaultPath))(()=> resolve(path)))

// branchValid :: (a -> b) -> String -> * -> Future m *
const branchValid = f => m => x => f(x) ? reject(m) : resolve(x)

// madeQuestionMaybe :: String -> Async e String
const madeAsk = q => ask(q)
  .pipe(chain(branchValid(gotWhiteSpaces)('Pattern can\'t contains spaces')))

// obtainPropDependencies :: String -> Future a b
const obtainPropDependencies = path => resolve(path)
  .pipe(chain(readdir))
  .pipe(chain(branchValid(isEmpty)('There is nothing')))
  .pipe(map(S.filter(getFileByExtension('json'))))
  .pipe(chain(getFromList('Select file: ')))
  .pipe(chain(encase(x => x.element)))
  .pipe(map(S.concat(S.concat(path)('/'))))
  .pipe(chain(readfile))
  .pipe(map(compose(stringify, prop('dependencies'), toJSON)))

// saveFile :: String -> Future a b -> Future a b
const saveFile = markdown => ask('name file: ')
  .pipe(chain(filename => writefile(`${filename}.json`)(markdown)))
  .pipe(map(x=> ' File saved !!'))

// proc :: String -> Async Nothing Just String
const proc = madeAsk('Give a valid Path')
  .pipe(chain(setDefaultFolderOnError('.')))
  .pipe(chain(obtainPropDependencies))
  .pipe(chain(saveFile))

export const cliJSON = () => fork(log('error'))(log('response'))(proc)