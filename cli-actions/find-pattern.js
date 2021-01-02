// find patterm

import { readDir, writefile, readfile, isdirectory, basename } from './../utils/fs'
import { fork, map, chain, bichain, resolve, parallel, ap } from 'fluture'
import { ask } from './../utils/cli';
import { compose, filter, flatten} from 'ramda';
import { ignoreHidden, getFileByExtension, toJSON, splitCodeLines, log, ignoreByName } from './../utils';
import { zip, extract, fst, pipe } from 'sanctuary';
import { Token, toArray } from './../fp/monad/tokenize'
import S from 'sanctuary'
import Generator from './../utils/generator'


// getFilesInDir :: String -> [Array] -> Future a b
const getFilesInDir = files => resolve(files)
  .pipe(map(filter(ignoreByName('node_modules'))))
  .pipe(map(filter(compose(ignoreHidden, basename))))
  .pipe(chain(filteredFiles => 
    parallel(Infinity)(filteredFiles.map(isdirectory))
      .pipe(map(isDir => zip(isDir)(filteredFiles)))
      .pipe(chain(recurDir))
      .pipe(map(flatten))
  ))

// searchInFiles :: [ String ] -> {} -> [ String ] -> [ String ]
const searchInFiles = titles => pattern => content => {
  const inmutableTitles = Generator.of(titles)
  const inmutableContent = Generator.of(content)

  return pipe([
    S.map(Token),
    S.map(x => x.filterWithPattern(pattern)),
    S.map(x => x.toMarkdown(splitCodeLines(inmutableContent.next()))),
    S.map(toArray),
    S.map(x => {
      const title = inmutableTitles.next()

      return x.length ? `\n\n##${title}${x.join('')}` : ''
    }),
  ])
  (content)
}

// readDirs :: [Pair a b] -> Future e [ String ]
const recurDir = dir => parallel(Infinity)(dir.map( p =>
  fst(p) 
    ? readDir(extract(p)).pipe(chain(getFilesInDir))
    : resolve(extract(p))
))

// getListFiles :: String -> Future e [String]
const getListFiles = path => readDir(path)
  .pipe(chain(getFilesInDir))
  .pipe(map(filter(compose(getFileByExtension('js'), basename))))

// setDefaultFolderOnError :: a -> b -> Future c d -> Future a b
const setDefaultFolderOnError = _defaultPath => path => isdirectory(path)
  .pipe(bichain(()=> resolve(_defaultPath))(()=> resolve(path)))

// saveMarkdown :: String -> Future a b -> Future a b
const saveMarkdonw = markdown => ask('name file: ')
  .pipe(chain(filename => writefile(`${filename}.md`)(markdown)))
  .pipe(map(x=> ' File saved !!'))

// filterTokenize -> String -> [ String ] -> Future
const filterTokenize = path => files => readfile('tokens.json')
  .pipe(map(toJSON))
  .pipe(chain(
    tokens => resolve(searchInFiles)
    .pipe(ap(resolve(files)))
    .pipe(ap(resolve(tokens)))
    .pipe(ap(parallel(Infinity)(files.map(readfile))))
  ))
  .pipe(map(x => `#(${path})\n\n${x.join('')}`))


const proc = ask('Give a path: ')
  .pipe(chain(setDefaultFolderOnError('.')))
  .pipe(chain(path => 
    getListFiles(path)
    .pipe(chain(files => filterTokenize(path)(files)))
  ))
  .pipe(chain(saveMarkdonw))
  


// compute
export const findPattern = () => fork(log('error'))(log('response'))(proc)