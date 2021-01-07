// fp-cli

import IO from './fp/monad/io';
import { Action } from './fp/monad/action';
import  Reader from './fp/monad/reader'
import { mergeRight, dissoc, prop} from 'ramda';
import yargs from 'yargs/yargs';

const defOptions = {
    action: 'find-json'
};


const actions = {
    [Action('find-json')]: () => import('./cli-actions/cli-folder').then(({cliJSON})=> cliJSON()),
    [Action('find-identify')]: () => import('./cli-actions/findincode').then(({findinfiles}) => findinfiles()),
    [Action('find-token')] : () => import('./cli-actions/find-pattern').then(({findPattern}) => findPattern()),
    [Action('crawl-dom')] : () =>  import('./cli-actions/crawl-dom').then(({crawlDom}) => crawlDom()),
    [Action('crawler')] : () => import('./cli-actions/crawler').then(({crawler}) => crawler()),

}

// withDefaults :: Object -> Object
const withDefaults = mergeRight(defOptions)
// removeUnnecesary :: Object -> Object
const removeUnnecesary = obj => dissoc('$0', dissoc('_', obj))
// ArgsIO:: object -> IO
const ArgsIO = argv => IO(() =>  yargs(argv));

// getArgs :: {} -> {} 
const getArgs = argv => ArgsIO(argv)
  .map(x => x.argv)
  .map(removeUnnecesary)
  .map(withDefaults)
  .unsafePerformIO()


const proc = Reader(x => x())
  .map(x => prop(Action(x)) (actions) )
  .map(prop('action'))
  .map(getArgs)


proc.run(process.argv)