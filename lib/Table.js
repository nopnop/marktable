// Import
var _            = require('underscore')
var slugify      = require('underscore.string').slugify
var repeat       = require('underscore.string').repeat
var re           = require('./regex')
var Row          = require('./Row')
var MultilineRow = require('./MultilineRow')
var Colgroup     = require('./Colgroup')
var Column       = require('./Column')
var Cell         = require('./Cell')
var TBody        = require('./TBody')

// Export
module.exports = Table

function Table(rawTable, offset) {
  this.rawTable  = rawTable;
  this.offset    = offset || 0;
  this.offsetEnd = offset + rawTable.length;
  this.id        = null;
  this.caption   = null;
  this._parse();
}

// TODO: Split me
Table.prototype._parse = function () {
  var self = this;

  // Remove remaining space
  var rawTable = this.rawTable.trim().replace(/[\t ]*$/mg, '');

  // Find caption and table id
  var reCaption = new RegExp('^(?:\\[\\s*(.*)\\s*\\])?(?:\\[\\s*(.*?)\\s*\\])[ \\t]*');
  rawTable = rawTable.replace(reCaption, function(match, c1, c2) {
    self.id = slugify(c2);
    self.caption = c1 ? c1 : c2;
    return '';
  })

  rawTable = '\n' + rawTable;

  // Split header / table rows
  var rows = '', alignements;
  var reExtractRows = new RegExp('\n('+re.tableDivider+')\n((' + re.tableRows +')+)','m');

  rawTable = rawTable.replace(reExtractRows, function(match, _alignements, _rows) {
    rows        = _rows;
    alignements = _alignements;
    return '';
  })
  var headers = rawTable.trim();

  // Process column alignment
  self.colgroup   = new Colgroup();
  var reColumn = /\|?\s*(.+?)\s*(\||\\Z)/g;
  var result;
  while((result = reColumn.exec(alignements)) !== null) {
    var rule = result[1].trim();
    if(/^:/.test(rule)) {
      if(/:$/.test(rule)) {
        self.colgroup.push(new Column(Column.ALIGN_CENTER))
      } else {
        self.colgroup.push(new Column(Column.ALIGN_LEFT))
      }
      // self.alignments.push(/:$/.test(rule) ? 'center' : 'left');
    } else if(/:$/.test(rule)) {
      self.colgroup.push(new Column(Column.ALIGN_RIGHT))
    } else {
      self.colgroup.push(new Column())
    }
  }

  // Process headers
  self.useRowHeader = false;
  self.headers = [];
  if(headers.trim() !== '') {
    headers.split('\n').forEach(function(line) {
      var row   = new Row();
      self.headers.push(row);
      var count = 0;
      var result;
      var re = /\|?(\s*[^\|]+?\s*)(\|+|\Z)/g;
      while ((result = re.exec(line)) !== null) {
        var content  = result[1];
        var ending   = result[2];
        var cell     = new Cell(content);
        cell.colspan = ending.replace(/^\s*(\|{2,})\s*$/, '$1').length;
        cell.header  = true;
        // cell.align   = self.alignments[count];
        row.push(cell);
        if(!count && (content.trim() === '')) {
          self.useRowHeader = true;
        }
        count++;
      }
    })
  }

  // Process rows
  self.tbodies = [];
  var tbody = new TBody();
  self.tbodies.push(tbody);

  rows.trim().split('\n').forEach(function(line) {
    if(/^\.+$/.test(line.trim())) {
      tbody = new TBody();
      self.tbodies.push(tbody);
    }
    var row   = new Row();
    tbody.rows.push(row);
    var count = 0;
    var result;
    var re = /\|?(\s*[^\|]+\s*?)(\|+|\Z)/g;
    while ((result = re.exec(line)) !== null) {
      var content  = result[1];
      var ending   = result[2];
      var cell     = new Cell(content);
      cell.colspan = ending.replace(/^\s*(\|{2,})\s*$/, '$1').length;
      cell.header  = count === 0 && self.useRowHeader;
      row.push(cell);
      count++;
    }
  })

  // Merge multilines rows
  self.tbodies.forEach(function(tbody) {
    tbody.mergeRows();
  })

}

Table.prototype.toMarkdown = function () {
  var self = this;
  self.normalize();
  var out = [];

  // Caption and table id
  if(self.caption) {
    out.push('['+self.caption+']' + (self.id ? '['+self.id+']' : ''));
  }

  // Headers
  self.headers.forEach(function(row) {
    out.push(row.toMarkdown(self.colgroup));
  })

  // column alignment
  out.push(self.colgroup.toMarkdown())

  // Headers
  var countTbody = self.tbodies.length;
  self.tbodies.forEach(function(tbody, i) {
    tbody.rows.forEach(function(row) {
      out.push(row.toMarkdown(self.colgroup));
    })
    if(countTbody !== (i-1)) {
      out.push('')
    }
  })

  return out.join('\n')
}

Table.prototype._getAllRow = function () {
  var allRows = [];
  this.headers.forEach(function(row) {
    allRows.push(row)
  })
  this.tbodies.forEach(function(tbody) {
    tbody.rows.forEach(function(row) {
      if(row instanceof MultilineRow) {
        // TODO: put this in TBody
        row.rows.forEach(function(row) {
          allRows.push(row)
        })
      } else {
        allRows.push(row)
      }
    })
  })
  return allRows;
};

Table.prototype.normalize = function () {
  var self = this;

  // Normalize columns size
  var allRows  = self._getAllRow();
  var colgroup = self.colgroup;

  // First pass normal cell
  allRows.forEach(function(row) {
    var index = 0;
    row.cells.forEach(function(cell) {
      if(cell.colspan === 1) {
        var sizeNeeded = cell.getContentSize();
        self.colgroup.upSizeTo(index, sizeNeeded);
      }
      index += cell.colspan;
    })
  })


  // Second pass (to adjust colspan cell)
  allRows.forEach(function(row) {
    var index = 0;
    row.cells.forEach(function(cell) {
      if(cell.colspan > 1) {
        var sizeNeeded       = cell.getContentSize();
        var currentSize      = colgroup.getFormatedSizeAt(index, cell.colspan);
        var remainSizeNeeded = sizeNeeded - currentSize;
        if(remainSizeNeeded > 0) {
          var sharedSize = Math.ceil(remainSizeNeeded / cell.colspan)
          _.range(index, index + cell.colspan).forEach(function(index) {
            if(remainSizeNeeded <= 0) return;
            var cur  = self.colgroup.getColumnAt(index).getSize();
            var add  = (remainSizeNeeded < sharedSize ? remainSizeNeeded : sharedSize);
            var upto = cur + add;
            self.colgroup.upSizeTo(index, upto);
            remainSizeNeeded -= add;
          })
        }
      }
      index += cell.colspan;
    })
  })

};
