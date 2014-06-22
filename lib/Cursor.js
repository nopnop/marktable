// Import


// Export
module.exports = Cursor

/**
 * Cursor is a abstract cursor position in a table that support table formating
 */
function Cursor(table) {
  this.table = table;

  // The line in a table relative to the table offset.
  //
  // The line could be any line in a marktable:
  // - caption and id row
  // - blank line between caption/id and table
  // - header row,
  // - column definition row,
  // - tbody separator,
  // - a row,
  // - a multiline-row separator
  this.line       = 0;

  // The cell index in the line
  this.cell       = 0;

  // The char offset from the left side of the cell
  this.cellOffset = 0;
}

// From row-column coordinate point relative to table offset
Cursor.prototype.fromPoint = function (point) {
  // body...
}

// To row-column coordinate point relative to table offset
Cursor.prototype.toPoint = function () {

}
