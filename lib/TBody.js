// Import
var MultilineRow = require('./MultilineRow')

// Export
module.exports = TBody

/**
 * Table Body
 *
 * @param {Array} rows Optional array of Row objects
 */
function TBody(rows) {
  this.rows = rows || [];
}

// transform row to multilinerow
// TODO: refactor: This is parsing step
TBody.prototype.mergeRows = function () {
  var self = this;
  var stack = [];
  var rows  = [];

  self.rows.forEach(function(row) {
    if(row.isSplitter()) {
      if(!stack.length) {
        // Ignore duplicate splitter ?
      } else {
        rows.push(new MultilineRow(stack));
      }
      stack = [];
    } else {
      stack.push(row)
    }
  })
  // Concat remaining row in stack
  self.rows = stack.length ? rows.concat(stack) : rows;
}

// TODO: Extract toMarkdown() implementation from Table to there
