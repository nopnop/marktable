// Import
var re         = require('./regex')
var Table      = require('./Table')

// Export
module.exports = Document

/**
 * Markdown document parser and editor
 *
 * @param {String} src Markdown source
 */
function Document(rawSrc) {
  this.tables = Document.parse(rawSrc);
}

/**
 * Find all markdown tables in a source and return an array of Table
 *
 * @param  {String} src Markdown source
 * @return {Array}     Array of markdown table objects
 */
Document.parse = function (src) {
  var reTable = new RegExp('^(' + re.wholeTable + ')(\n|\\Z)','mg')
  var result, tables = [];
  while ((result = reTable.exec(src)) !== null) {
    tables.push(new Table(result[0], result.index));
  }
  return tables;
}
