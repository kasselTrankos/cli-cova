// compare
const EQ = 0
const concatOrd = (o1, o2) => o2 || o1
const everyOrd = (o1, o2) => o2 && o1
const emptyOrd = () => EQ
const prototype = {
    'constructor' : Compare,
    'fantasy-land/contramap': compare$contramap,
    'contramap': compare$contramap,
    'fantasy-land/concat': compare$concat,
    'concat': compare$concat,
    'fantasy-land/empty': compare$empty,
    'empty': compare$empty,
    'and': compare$and
}

function Compare(f) {
    const compare = Object.create(prototype)
    compare.compare = f

    return compare
}

// contramap :: Contravariant f => f a ~> (b -> a) -> f b
function compare$contramap(f) {
    return Compare((x,y) => this.compare(f(x), f(y)))
}

function compare$concat(that) {
    return Compare((x, y) => concatOrd(this.compare(x, y), that.compare(x, y)))
}
function compare$and(that) {
    return Compare((x, y) => everyOrd(this.compare(x, y), that.compare(x, y)))
}
function compare$empty() {
    return compare( _ => true)
}





module.exports = Compare