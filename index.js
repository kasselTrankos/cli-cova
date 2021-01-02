// fp-cli
import {cliJSON} from './cli-actions/cli-folder';
import { findinfiles } from './cli-actions/findincode';
import { findPattern} from './cli-actions/find-pattern'
import IO from './fp/monad/io';
import {Executor, Action} from './fp/monad/executor';
import { mergeRight, dissoc} from 'ramda';
import yargs from 'yargs/yargs';

const defOptions = {
    action: 'find-json',
};


const actions = {
    [Action('find-json')]: () => cliJSON(path),
    [Action('find-identify')]: () => findinfiles(),
    [Action('find-token')] : () => findPattern()

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

// proc :: {} -> void
const proc = args => Executor(actions)
  .action(Action(args.action))
  .run()


proc(getArgs(process.argv))