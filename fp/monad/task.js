function Task(computation, complete) {
  this.fork = computation;
  this.cleanup = complete || function() {};
}


// of :: Applicative f => f ~> a -> f a
Task.of = function(x){
  return new Task((_, resolve) => resolve(x));
}

// map :: Functor => f a ~> (a -> b) -> f b
Task.prototype.map = function(f) {
  return new Task((reject, resolve)=> {
    this.fork((a)=> reject(a), a => resolve(f(a))),
    this.cleanup
  })
}

module.exports = Task;