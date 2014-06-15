// Import
var _      = require('underscore')
var repeat = require('underscore.string').repeat
var debug  = require('debug')('marktable:Table')
var Cell   = require('./Cell')
// var clc    = require('cli-color')

// Export
module.exports = Row

/**
 * Table row
 */
function Row() {
  this.cells  = [];
  this.header = false;
}

Row.prototype.parse = function (src) {
  this.cells = [];
  // var re = /\|?(\s*([^\|]|\\\|)+?\s*)(([^\\]\|)+|\Z)/g;
  var re = /\|?(\s*[^\|]+\s*?)(\|+|)/g
  while ((result = re.exec(src)) !== null) {
    var content  = result[1];
    var ending   = result[2];
    var cell     = new Cell(content);
    cell.colspan = ending.replace(/^\s*(\|{2,})\s*$/, '$1').length || 1;
    cell.header  = this.header;
    this.push(cell);
  }
};

/**
 * Add a cell in row
 * @param  {Cell} cell
 */
Row.prototype.push = function (cell) {
  this.cells.push(cell);
}

// /**
//  * Parser utility: this is a splitter cell
//  * TODO: Refactor me - maybe not the right place
//  */
// Row.prototype.isSplitter = function () {
//   return _.all(this.cells, function(cell) {
//     return /^\-+$/.test(cell.content.trim());
//   })
// }

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
