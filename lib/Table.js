// Import
var _            = require('underscore')
var repeat       = require('underscore.string').repeat
var re           = require('./regex')
var Row          = require('./Row')
var MultilineRow = require('./MultilineRow')
var Colgroup     = require('./Colgroup')
var Column       = require('./Column')
var Cell         = require('./Cell')
var TBody        = require('./TBody')
var debug        = require('debug')('marktable:Table')

// Export
module.exports = Table

function Table() {
  this.id        = undefined;
  this.caption   = undefined;
  this.headers   = [];
  this.colgroup  = new Colgroup();
  this.tbodies   = [];
  this.styles    = {
    border:  true
  }
}

Table.prototype.parse = function(src, offset) {
  this.rawTable  = src;
  var match      = re.wholeTable.exec(src);
  if(!match) return false;
  var infos      = {
    offset:    0,
    offsetEnd: match[0].length,
    raw:       match[0],
    caption:   match[1],
    headers:   match[2],
    columns:   match[3],
    rows:      match[4]
  }

  this.handleParseResult(infos);

  return infos;
}

Table.prototype.handleParseResult = function (pResult) {
  var self = this;
  var match, reg;

  // Read captions and id
  if(pResult.caption) {
    match = this._handleCaption(pResult.caption)
    this.id      = match[1] ? match[2].trim() : undefined
    this.caption = match[1] ? match[1] : match[2]
  }

  // Read headers
  if(pResult.headers) {
    this.headers = this._handleHeaders(pResult.headers);
  }

  // Read columns
  this.colgroup.parse(pResult.columns)

  // Read rows
  if(pResult.rows) {
    pResult.rows.trim().split(/\n[\s\.]*\n/g).forEach(function(body) {
      var tbody = new TBody()
      tbody.parse(body)
      self.tbodies.push(tbody)
    })
  }

  // Extract style information:
  this.styles.border = /^|/.test(pResult.columns);
}

Table.prototype._handleCaption = function (caption) {
  var reg      = /^(?:\[([^\]]*?)\])?(?:\[([^\]]*?)\])[ \t]*/
  var match    = reg.exec(caption);
  return match;
}

Table.prototype._handleHeaders = function (headers) {
  var result = [];
  headers.trim().split('\n').forEach(function(line) {
    var row   = new Row();
    row.parse(line)
    result.push(row);
  })
  return result;
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
    out.push(tbody.toMarkdown(self.colgroup))
    if((countTbody - 1) !== i) {
      out.push(repeat(' ',self.colgroup.getFullFormatedSize()))
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
}

Table.prototype.getInfos = function () {
  return {
    id:      this.id,
    caption: this.caption,
    headers: this.headers ? this.headers.length : 0,
    columns: this.colgroup.columns.length,
    bodies:  this.tbodies.length,
    rows:    this.tbodies.reduce(function(memo, tbody) {
      return memo + tbody.rows.length
    },0),
    lines:   this.tbodies.reduce(function(memo, tbody) {
      return memo + tbody.getInfos().lines
    }, 0),
  }
}
