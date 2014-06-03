// Import
var re         = require('./regex')
var Table      = require('./Table')
var _          = require('underscore')

// Export
module.exports = marktable

/**
 * Format each table in a markdown source
 * 
 * @param  {String} src Markdown source
 * @param  {Object} options Formating option (not used yet)
 * @return {String}
 */
function marktable(src /*, options*/) {
  // TODO: without src (and eventually options)
  // this function may return a transform stream
  // that bufferize only table data
  return marktable.parse(src, function(table) {
    return table.toMarkdown(/*options*/);
  })
}

/**
 * Parse synchronously a source and call a function on each table object found
 *
 * @param  {String} src
 *         Markdown source
 *
 * @param  {Function} handleTable
 *         A function that receive two arguments: a table object and the offset
 *         This function may return undefined or a transformed table source to
 *         replace the table in the body
 *
 * @return {String}
 *         The source after transformation
 */
marktable.parse = function(src, handleTable) {
  var reTable = new RegExp('^(' + re.wholeTable + ')(\n)','mg')

  var trim    = false;
  if(!/\n$/.test(src)) {
    // No empty line before EOF, (\Z do not work in JS)
    // We add a EOL that removed later
    src += '\n';
    trim = true;
  }

  return src.replace(reTable, function(rawTable) {
    var args   = Array.prototype.slice.call(arguments);
    var offset = args[args.length - 2];
    var rest   = args[args.length - 3];

    var table     = new Table(rawTable.slice(0,0-rest.length), offset);
    var result    = handleTable(table, offset);
    result = result !== undefined ? (result + rest) : rawTable;
    if(trim) {
      result = result.trim();
    }
    return result;
  })
}

/**
 * Return a transform stream
 *
 * @param  {Function} handleTable
 *         A function that receive two arguments: a table object and the offset
 *         This function may return undefined or a transformed table source to
 *         replace the table in the body
 *
 * @return {Stream.Transform}
 */
marktable.transform = function(handleTable) {
  // TODO: Return a transform stream
}


// Expose API
marktable.Document     = require('./Document')
marktable.Cell         = require('./Cell')
marktable.Colgroup     = require('./Colgroup')
marktable.Column       = require('./Column')
marktable.MultilineRow = require('./MultilineRow')
marktable.Row          = require('./Row')
marktable.Table        = require('./Table')
marktable.TBody        = require('./TBody')
