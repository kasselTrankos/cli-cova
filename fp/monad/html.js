// html-cheerio
import cheerio from 'cheerio';
const daggy = require('daggy');
import IO from './io'

export const htmlIO = daggy.tagged('IO', ['unsafePerformIO']);
htmlIO.of = function(dom) {
    return htmlIO(()=> cheerio.load(dom))
}

export const html = a => io => io.html(a)
htmlIO.prototype.html = function(a) {
    const $ = this.unsafePerformIO()
    return htmlIO(()=> $(a).html())
} 
export const map = f => io => io.map(f)
htmlIO.prototype['fantasy-land/map'] = htmlIO.prototype.map = function(f) {
    return htmlIO(()=> f(this.unsafePerformIO()))
} 