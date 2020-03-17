const {tagged} = require('daggy');
const Pair = T => {
  const Pair_ = tagged('Pair', ['_1', '_2']);

  Pair_.prototype.map = function (f) {
    return Pair_(this._1, f(this._2))
  }

  Pair_.prototype.ap = function (fs) {
    return Pair_(fs._1.concat(this._1), fs._2(this._2))
  }

  Pair_.prototype.chain = function (f) {
    const that = f(this._2)

    return Pair_(this._1.concat(that._1), that._2)
  }

  Pair_.of = x => Pair_(T.empty(), x)

  return Pair_

};

module.exports = Pair;