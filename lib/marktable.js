


module.exports = marktable

function marktable(src) {
  return (new marktable.Document(src));
}

marktable.Document     = require('./Document')
marktable.Cell         = require('./Cell')
marktable.Colgroup     = require('./Colgroup')
marktable.Column       = require('./Column')
marktable.MultilineRow = require('./MultilineRow')
marktable.Row          = require('./Row')
marktable.Table        = require('./Table')
marktable.TBody        = require('./TBody')
