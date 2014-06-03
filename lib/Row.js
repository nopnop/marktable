// Import
var _      = require('underscore')
var repeat = require('underscore.string').repeat

// Export
module.exports = Row

/**
 * Table row
 */
function Row() {
  this.cells = [];
}

/**
 * Add a cell in row
 * @param  {Cell} cell
 */
Row.prototype.push = function (cell) {
  this.cells.push(cell);
}

/**
 * Parser utility: this is a splitter cell
 * TODO: Refactor me - maybe not the right place
 */
Row.prototype.isSplitter = function () {
  return _.all(this.cells, function(cell) {
    return /^\-+$/.test(cell.content.trim());
  })
}

/**
 * Generate a markdow representation of this Row
 * @param {Colgroup} colgroup
 *        A Colgroup object (provide column size and aligment informations)
 * @return {String}
 */
Row.prototype.toMarkdown = function (colgroup) {
  var out = [];
  out.push('|');
  var index = 0;
  this.cells.forEach(function(cell) {
    var align = colgroup.getAlignAt(index);
    var size  = colgroup.getFormatedSizeAt(index, cell.colspan);
    out.push(cell.toMarkdown(align, size))
    out.push(repeat('|',cell.colspan));
    index += cell.colspan;
  })

  // Add missing empty cells
  // TODO: Refactor: move this in the Table normalization process ?
  if(index < colgroup.columns.length) {
    _.range(index, colgroup.columns.length).forEach(function(index) {
      out.push(' ' + repeat(' ',colgroup.getFormatedSizeAt(index)) + ' |')
    })
  }

  return out.join('')
}
