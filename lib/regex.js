// Some regex are inpired from MultiMarkdown perl implementation
// https://github.com/fletcher/MultiMarkdown/blob/master/bin%2FMultiMarkdown.pl
var debug  = require('debug')('marktable:regexp')

// Reusable regex parts
exports.tableCaption = /\[.*?\][ \t]*[\n]*/
exports.firstRow     = /\S+.*?/
exports.headerRow    = /[^\n]*?\|[^\n]*?\n/
exports.tableDivider = /[\|\-\+\:\.][ \-\+\|\:\.]*\|[ \-\+\|\:\.]*?\n/
exports.tableRows    = /(?:\n?[^\n]*?\|[^\n]*\n|\n?[\.\s]+?)+/
exports.wholeTable   = new RegExp(
    '('+ exports.tableCaption.source +')?'
  + '('+ exports.firstRow.source + '(?:'+ exports.headerRow.source + ')+?)?'
  + '('+ exports.tableDivider.source +')'
  + '('+ exports.tableRows.source +')')

debug('Whole table regex:', exports.wholeTable)
