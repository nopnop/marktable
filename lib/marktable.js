// Import
var re         = require('./regex')
var Table      = require('./Table')
var _          = require('underscore')

// Export
module.exports = marktable


function marktable(src, handleTable) {
  var reTable = new RegExp('^(' + re.wholeTable + ')(\n)','mg')

  var trim    = false;
  if(!/\n$/.test(src)) {
    // No empty line before EOF, (\Z do not work in JS)
    // We add a EOL that removed later
    src += '\n';
    trim = true;
    console.log('trim')
  }
  return src.replace(reTable, function(rawTable) {
    var args   = Array.prototype.slice.call(arguments);
    var offset = args[args.length - 2];
    var rest   = args[args.length - 3];

    var table     = new Table(rawTable.slice(0,0-rest.length), offset);
    var result    = handleTable(table, offset);
    result = result !== undefined ? (result + rest) : rawTable;
    if(trim) {
      result = result.trim();
    }
    return result;
  });
}

marktable.Document     = require('./Document')
marktable.Cell         = require('./Cell')
marktable.Colgroup     = require('./Colgroup')
marktable.Column       = require('./Column')
marktable.MultilineRow = require('./MultilineRow')
marktable.Row          = require('./Row')
marktable.Table        = require('./Table')
marktable.TBody        = require('./TBody')
