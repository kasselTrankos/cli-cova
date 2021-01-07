// dom.js
const $ = require('sanctuary-def')
const Z = require('sanctuary-type-classes')
const type = require ('sanctuary-type-identifiers')

const prototype = {
    '@@type':           'my/dom@1',
    'extract':           dom$prototype$extract,
    'fantasy-land/map': dom$prototype$map, 
    'fantasy-land/concat': dom$prototype$concat, 
}

function Dom(a) {
    const dom = Object.create(prototype)

    dom.value = a
    return dom
}

const $Dom = $.UnaryType
  ('Sum')
  ('http://example.com/my-package#Dom')
  ([])
  (x => type(x) === 'my/dom@1')
  (({value}) => [value] )


function dom$prototype$concat(that) {
  console.log(this.value, that.value, 'c')
    return Dom(Z.concat(this.value, that.value))
}

function dom$prototype$map(f) {
    return Dom(f(this.value))
}

function dom$prototype$extract() {
  return this.value
}

Dom.env = $Dom;

module.exports = Dom