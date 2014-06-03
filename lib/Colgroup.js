// Import
var Column = require('./Column')
var _      = require('underscore')

// Export
module.exports = Colgroup

/**
 * Store and manage column object of a Table
 * @param {Array} columns Optional array of Columns
 */
function Colgroup(columns) {
  this.columns = columns || [];
}

/**
 * Add a Column
 *
 * @param  {Column} column
 */
Colgroup.prototype.push = function (column) {
  this.columns.push(column)
}

/**
 * Generate a markdown formated colgroup
 */
Colgroup.prototype.toMarkdown = function () {
  var out = ['|'];
  this.columns.forEach(function(column) {
    out.push(column.toMarkdown() + '|')
  })
  return out.join('')
}

/**
 * Get one column object at a given index
 *
 * This method always return a column object: if the index
 * is out of range, the colgroup is filled with empty column.
 *
 * @param {integer} atIndex
 */
Colgroup.prototype.getColumnAt = function (atIndex) {
  while(this.columns.length <= atIndex) {
    this.columns.push(new Column());
  }
  return this.columns[atIndex];
}

/**
 * Set how many chars a column could contain only if size is greater than
 * current size
 *
 * @param {integer} atIndex
 * @param {integer} size    How many char column atIndex must contain at least
 */
Colgroup.prototype.upSizeTo = function(atIndex, size) {
  this.getColumnAt(atIndex).upSizeTo(size);
}

/**
 * Get column size at a given index
 *
 * If a cell colspan is provided, return the cumulated columns  size
 *
 * @param {integer} atIndex
 * @param {integer} colspan Optional: how many columns must be cumulated to size
 * @return {integer} Column size or cumulated columns size
 */
Colgroup.prototype.getSizeAt = function (atIndex, colspan) {
  var self = this;
  var size = 0;
  colspan  = colspan ? colspan : 1;
  _.range(atIndex, atIndex + colspan).forEach(function(index) {
    size += self.getColumnAt(index).getSize();
  })
  return size;
}

/**
 * Get formated column size at a given index with padding
 *
 * The column size in term of "how many chars those colums can contain in a
 * formated markdown output":
 * A cell with a colspan > 1 must always contain the pipe for each column
 * collapsed but have a gain of two padding space for each column.
 *
 * @param {integer} atIndex
 * @param {integer} colspan Optional: how many columns must be cumulated to size
 */
Colgroup.prototype.getFormatedSizeAt = function (atIndex, colspan) {
  var size = this.getSizeAt(atIndex, colspan)
  colspan  = colspan || 1;
  size += (colspan - 1) * 2;
  return size;
}

/**
 * Return column alignement
 * 
 * @param {integer} atIndex
 * @return {String} A Column alignement constant
 */
Colgroup.prototype.getAlignAt = function (atIndex) {
  return this.getColumnAt(atIndex).align;
}