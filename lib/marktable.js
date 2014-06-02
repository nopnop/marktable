var _       = require('underscore')
var slugify = require('underscore.string').slugify;
var repeat  = require('underscore.string').repeat;
var pad     = require('underscore.string').pad;


var line_start = '[ ]{0,2}'
var line_start = ''

var table_row     = '[^\n]*?\\|[^\n]*?[\n]*'

var first_row     = line_start + '\\S+.*?\\|.*?[\n]*'

var table_rows    = '([\n]?' + table_row +')'

var table_caption = line_start + '\\[.*?\\][ \\t]*[\n]*'

var table_divider = line_start + '[\\|\\-\\+\\:\\.][ \\-\\+\\|\\:\\.]*\\|[ \\-\\+\\|\\:\\.]*'

var whole_table =
    '('+table_caption+')?'		// Optional caption
  + '('+ first_row				    // First line must start at beginning
  + '('+ table_row +')*?)?'	 // Header Rows
  + table_divider			       // Divider/Alignment definitions
  + table_rows+'+'			      // Body Rows
  + '('+ table_caption +')?'	// Optional caption


module.exports = function(src) {
  return (new Document(src));
}

function Document(src) {
  this.src = src;
  this.tables = Document._parse(src);
}

Document._parse = function (src) {
  var reg = new RegExp('^(' + whole_table + ')(\n|\Z)','mg')

  var result, tables = [];

  while ((result = reg.exec(src)) !== null) {
    (function() {
      var table = new Table(
        result.index,
        result.index + result[0].length,
        result[0])
      tables.push(table);
      table.parse();
    }());

  }

  return tables;
};



function Table(start, end, raw) {
  this.start = start;
  this.end   = end;
  this.raw   = raw;

  // Parsed informations:
  this.id      = null;
  this.caption = null;
}


Table.prototype.parse = function () {
  var self = this;
  var re;

  // Remove remaining space
  var raw = this.raw.trim().replace(/[\t ]*$/mg, '');


  // Find caption and table id
  re = new RegExp('^' + line_start + '(?:\\[\\s*(.*)\\s*\\])?(?:\\[\\s*(.*?)\\s*\\])[ \\t]*');
  raw = raw.replace(re, function(match, c1, c2) {
    self.id = slugify(c2);
    self.caption = c1 ? c1 : c2;
    return '';
  })

  raw = '\n' + raw;

  // Split header / table rows
  var rows = '', alignements;
  re = new RegExp('\n('+table_divider+')\n((' + table_rows +')+)','m');
  // console.log('Table regex:','\n('+table_divider+')\n((' + table_rows +')+)')
  raw = raw.replace(re, function(match, _alignements, _rows) {
    rows        = _rows;
    alignements = _alignements;
    return '';
  })
  var headers = raw.trim();

  // Process column alignment
  self.colgroup   = new Colgroup();
  // self.alignments = [];
  var re = /\|?\s*(.+?)\s*(\||\Z)/g;
  var result;
  while((result = re.exec(alignements)) !== null) {
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
  if(headers.trim() != '') {
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
        row.addCell(cell);
        if(!count && (content.trim() == '')) {
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
    if('' == line.trim()) {
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
      // cell.align   = self.alignments[count];
      row.addCell(cell);
      count++;
    }
  })

  // Merge multilines rows
  self.tbodies.forEach(function(tbody) {
    tbody.mergeRows();
  })

}

Table.prototype.addColumn = function (index) {
  // body...
};

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
    console.log('Header row')
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
    if(countTbody != (i-1)) {
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
  var allRows = self._getAllRow();
  var colgroup = self.colgroup;

  // First pass
  allRows.forEach(function(row, rowIndex) {
    var index;

    // First pass
    index = 0;
    row.cells.forEach(function(cell) {
      var sizeNeeded = cell.getContentSize();
      if(cell.colspan == 1) {
        // console.log('[row:%s] sizeNeeded at index:%s', rowIndex, index, sizeNeeded)
        self.colgroup.upSizeTo(index, sizeNeeded);
      } else {
        // // Each colspan span remove two padding (pipe are moved at end)
        // sizeNeeded -= (cell.colspan - 1) * 2;
        // var sharedSize = Math.ceil(sizeNeeded / cell.colspan)
        // // Size needed is shared by other columns
        // _.range(index, index + cell.colspan).forEach(function(index) {
        //   self.colgroup.upSizeTo(index, sharedSize);
        // })
      }
      index += cell.colspan;
    })
  })


  // Second pass (to adjust colspan)
  allRows.forEach(function(row, rowIndex) {
    // Second pass (to adjust colspan)
    var index = 0;
    row.cells.forEach(function(cell) {
      if(cell.colspan == 1) {
        index++;
        return;
      };
      var sizeNeeded = cell.getContentSize();
      console.log('[row:%s] sizeNeeded at index:%s', rowIndex, index, sizeNeeded)

      // Each colspan require on char (a pipe)
      // sizeNeeded += (cell.colspan - 1);

      // Each colspan span remove two padding (pipe are moved at end)

      // Get current size provided by non-colspan columns
      var currentSize = colgroup.getFormatedSizeAt(index, cell.colspan);

      // Colspan offer 2 chars: two padding
      // currentSize -= (cell.colspan - 1) * 2;

      var remainSizeNeeded = sizeNeeded - currentSize;
      if(remainSizeNeeded > 0) {

        console.log('[index:%s] sizeNeeded:%s currentSize:%s remainSizeNeeded:%s cell.colspan:%s',index, sizeNeeded, currentSize, remainSizeNeeded, cell.colspan)
  // self.colgroup.upSizeTo(index, remainSizeNeeded);
        var sharedSize = Math.ceil(remainSizeNeeded / cell.colspan)
        // if(sharedSize < 2) sharedSize = 2;
        console.log('shared size', sharedSize)
        // Size needed is shared by other columns
        _.range(index, index + cell.colspan).forEach(function(index) {
          console.log(' index:',index,remainSizeNeeded)
          if(remainSizeNeeded <= 0) return;
          var cur = self.colgroup.getColumnAt(index).getSize();
          var add = (remainSizeNeeded < sharedSize ? remainSizeNeeded : sharedSize);
          var upto = cur + add;
          console.log('  upto', upto);
          self.colgroup.upSizeTo(index, upto);
          remainSizeNeeded -= add;
        })
      }
      index += cell.colspan;
    })
  })



};

function TBody() {
  this.rows = [];
}

// transform row to multilinerow
TBody.prototype.mergeRows = function () {
  var self = this;
  var stack = [];
  var rows  = [];

  self.rows.forEach(function(row, index) {
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

function Row() {
  this.cells = [];
}

Row.prototype.addCell = function (cell) {
  this.cells.push(cell);
}

Row.prototype.isSplitter = function () {
  return _.all(this.cells, function(cell) {
    return /^\-+$/.test(cell.content.trim());
  })
}

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

  if(index < colgroup.columns.length) {
    _.range(index, colgroup.columns.length).forEach(function(index) {
      out.push(' ' + repeat(' ',colgroup.getFormatedSizeAt(index)) + ' |')
    })
  }

  return out.join('')
};

function MultilineRow(rows) {
  this.rows = rows ? rows : [];
}

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
    var align = colgroup.getAlignAt(index);
    var size  = colgroup.getFormatedSizeAt(index, cell.colspan);
    splitter += ' ' + repeat('-', size) + ' ';
    splitter += repeat('|',cell.colspan);
    index += cell.colspan;
  })

  out.push(splitter);

  return out.join('\n')
};

MultilineRow.prototype.toRow = function () {
  var self  = this;

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
};

function Cell(content, options) {
  options = options || {};
  this.content = content;
  this.colspan = options.colspan || 1;
  this.header  = options.header === true;
  this.align   = options.align; //TODO: REMOVE ME
}

Cell.prototype.clone = function () {
  return new Cell(this.content, {
    colspan: this.colspan,
    header:  this.header,
    align:   this.align
  })
};

Cell.prototype.getContentSize = function () {
  return this.content.trim().length
};

Cell.prototype.toMarkdown = function(align, size, margin) {
  var content = this.content.trim();

  switch(align) {
    case Column.ALIGN_RIGHT:
      content = pad(content, size, ' ', 'left');
      break;
    case Column.ALIGN_CENTER:
      content = pad(content, size, ' ', 'both');
      break;
    case Column.ALIGN_LEFT:
    default:
      content = pad(content, size, ' ', 'right');
  }

  margin = repeat(' ', margin || 1)
  return margin+ content +margin;
}

function Column(align, size) {
  this.align = align;
  this.size  = size;
}

Column.ALIGN_LEFT   = 'left';
Column.ALIGN_RIGHT  = 'right';
Column.ALIGN_CENTER = 'center';

Column.prototype.toMarkdown = function () {
  var out = [];
  var size = this.getSize();
  switch(this.align) {
  case 'left':
    out.push(':' + repeat('-', size + 1))
    break;
  case 'right':
    out.push(repeat('-', size + 1) + ':')
    break;
  case 'center':
    out.push(':' + repeat('-', size) + ':')
    break;
  default:
    out.push(repeat('-',size+2))
  }
  return out.join('')
};

Column.prototype.setSize = function (size) {
  this.size = size;
};

Column.prototype.upSizeTo = function (size) {
  this.size = this.size || 1;
  this.size = size > this.size ? size : this.size;
};

Column.prototype.getSize = function () {
  return (!this.size || (this.size < 1)) ? 1 : this.size
};

function Colgroup(columns) {
  this.columns = columns || [];
}

Colgroup.prototype.push = function (column) {
  this.columns.push(column)
};

Colgroup.prototype.toMarkdown = function () {
  var out = ['|'];
  this.columns.forEach(function(column) {
    out.push(column.toMarkdown() + '|')
  })
  return out.join('')
};

Colgroup.prototype.getColumnAt = function (atIndex) {
  while(this.columns.length < (atIndex + 1)) {
    this.columns.push(new Column());
  }
  return this.columns[atIndex];
};

Colgroup.prototype.upSizeTo = function(atIndex, size) {
  this.getColumnAt(atIndex).upSizeTo(size);
}

Colgroup.prototype.getSizeAt = function (index, colspan) {
  var self = this;
  var size = 0;
  colspan = colspan ? colspan : 1;
  _.range(index, index + (colspan || 1)).forEach(function(index) {
    size += self.getColumnAt(index).getSize();
  })

  // size += (colspan - 1) * 2;
  return size;
}

Colgroup.prototype.getFormatedSizeAt = function (index, colspan) {
  var size = this.getSizeAt(index, colspan)

  // Colspan use 2 chars: two padding
  size += (colspan - 1) * 2;

  return size;
}


Colgroup.prototype.getAlignAt = function (atIndex) {
  return this.getColumnAt(atIndex).align;
};
