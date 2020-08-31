const Z = require ('sanctuary-type-classes');
const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');


const {Task} = require('./../fp/monad'); 
describe('Test', ()=> {
  const {composition} = laws.Apply(Z.ap);
  const TaskArb = jsc.number.smap (Task.of, sum => sum + 1, show);

  const testTask =  composition(TaskArb, TaskArb, TaskArb)
  it('ap', testTask);
});