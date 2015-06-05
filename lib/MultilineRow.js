// Import
var repeat = require('lodash.repeat')
var Row = require('./Row')

// Export
module.exports = MultilineRow

/**
 * A table multiline row (a controlled list of basic row)
 *
 * @param {Array} rows An optional array of Row objects
 */
function MultilineRow(rows) {
  this.rows = rows ? rows : [];
}

/**
 * Generate a markdown representation of this Row
 * @param {Colgroup} colgroup
 *        A Colgroup object (provide column size and aligment informations)
 * @return {String}
 */
MultilineRow.prototype.toMarkdown = function (colgroup) {
  var out = [];

  this.rows.forEach(function(row) {
    out.push(row.toMarkdown(colgroup));
  })

  // Multiline splitter use the same column spaning than
  // it cell (but this is only a visual effect)
  var splitter = '|';
  var index = 0;
  this.rows[0].cells.forEach(function(cell){
    var size  = colgroup.getFormatedSizeAt(index, cell.colspan);
    splitter += ' ' + repeat('-', size) + ' ';
    splitter += repeat('|',cell.colspan);
    index += cell.colspan;
  })

  out.push(splitter);

  return out.join('\n')
}

/**
 * Compact MultilineRow to a basic Row object
 *
 * Note that cells content now contain line-return: you can note use this
 * row for markdown output without reformating
 * (but this may be usefull for html output)
 *
 * @return {String}
 */
MultilineRow.prototype.toRow = function () {
  var newRow = new Row();
  this.rows.forEach(function(row) {
    row.cells.forEach(function(cell, index) {
      if(!newRow.cells[index]) {
        newRow.cells[index] = cell.clone();
      } else {
        newRow.cells[index].content += '\n' + cell.content;
      }
    })
  })
  return newRow;
}
