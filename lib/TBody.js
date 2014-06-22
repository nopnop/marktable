// Import
var MultilineRow = require('./MultilineRow')
var Row          = require('./Row')

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

TBody.prototype.parse = function (src) {
  var self  = this;
  self.rows = [];

  var stack = [];
  var rows  = [];

  function isSplitter(line) {
    return /^[\s\-\|]*$/.test(line)
  }

  src.trim().split('\n').forEach(function(line) {
    if(isSplitter(line)) {
      if(!stack.length) {
        // Ignore duplicate splitter ?
      } else {
        rows.push(new MultilineRow(stack));
      }
      stack = [];
    } else {
      var row   = new Row();
      row.parse(line)
      stack.push(row)
    }
  })

  self.rows = stack.length ? rows.concat(stack) : rows;
}

TBody.prototype.toMarkdown = function (colgroup) {
  var out = [];
  this.rows.forEach(function(row) {
    out.push(row.toMarkdown(colgroup));
  })
  return out.join('\n')
}

TBody.prototype.getInfos = function () {
  return {
    rows:  this.rows.length,
    lines: this.rows.reduce(function(memo, row) {
      if(row instanceof MultilineRow) {
        return memo + row.rows.length
      } else {
        return memo + 1;
      }
    },0)
  }
}
