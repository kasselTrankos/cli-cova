// boolean
const compose = f => g => x => f(g(x))

const prototype = {
    'constructor' : Bool,
    'fantasy-land/contramap': bool$contramap,
    'contramap': bool$contramap,
    'fantasy-land/concat': bool$concat,
    'concat': bool$concat,
    'fantasy-land/empty': bool$empty,
    'empty': bool$empty
}

function Bool(f) {
    const bool = Object.create(prototype)
    bool.run = f

    return bool
}

// contramap :: Contravariant f => f a ~> (b -> a) -> f b
function bool$contramap(f) {
    return Bool(compose(this.run)(f))
}

function bool$concat(that) {
    return Bool(x => this.run(x) && that.run(x))
}
function bool$empty() {
    return Bool( _ => true)
}



module.exports = Bool