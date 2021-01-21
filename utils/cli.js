//Cli
import inquirer from 'inquirer';
import { Future, chain, encase } from 'fluture'


// getFromList :: String -> Array -> Async Error String 
export const getFromList = question => list => Future((rej, res)=> {
    inquirer
      .prompt([{
        name: 'element',
        type: "list",
        message: question,
        choices: list,
        },])
      .then(res)
      .catch(rej);
    return ()=> { console.log('CANT BE STOP')}
  });

// question :: String -> Future Error String
export const question = q =>  Future((rej, res) => {
    inquirer.prompt([{
      name: 'element',
      type: "input",
      message: q,
    },])
    .then(res)
    .catch(rej)
  return () => { console.log('CANT STOP IT')}
});

// ask :: String -> Future a String
export const ask = q => question(q)
  .pipe(chain(encase(x => x.element)))

