// boolean

const prototype = {
    'constructor' : Bool,
    'fantasy-land/contramap': bool$contramap,
    'contramap': bool$contramap
}

function Bool(f) {
    const bool = Object.create(prototype)
    bool.f = f

    return bool
}

// contramap :: Contravariant f => f a ~> (b -> a) -> f b
function bool$contramap(f) {
    return Bool(x => this.f(f(x)))
}



module.exports = Bool