// Import
var repeat = require('lodash.repeat')

// Export
module.exports = Column

/**
 * A table column description
 *
 * @param {String|null} align Alignement (see class constants)
 * @param {Integer} size  Column width (char count)
 */
function Column (align, size) {
  this.align = align
  this.size = size
}

Column.ALIGN_LEFT = 'left'
Column.ALIGN_RIGHT = 'right'
Column.ALIGN_CENTER = 'center'
Column.ALIGN_DEFAULT = 'default'

/**
 * Generate a markdown formated column
 */
Column.prototype.toMarkdown = function () {
  var out = []
  var size = this.getSize()
  switch (this.align) {
    case 'left':
      out.push(':' + repeat('-', size + 1))
      break
    case 'right':
      out.push(repeat('-', size + 1) + ':')
      break
    case 'center':
      out.push(':' + repeat('-', size) + ':')
      break
    default:
      out.push(repeat('-', size + 2))
  }
  return out.join('')
}

/**
 * Set how many chars this column could contain
 *
 * @param {integer} size
 */
Column.prototype.setSize = function (size) {
  this.size = size
}

/**
 * Set how many chars this column could contain only if size is greater than
 * current size
 *
 * @param {integer} size
 */
Column.prototype.upSizeTo = function (size) {
  this.size = this.size || 1
  this.size = size > this.size ? size : this.size
}

/**
 * Get the column size (always >= 1)
 */
Column.prototype.getSize = function () {
  return (!this.size || (this.size < 1)) ? 1 : this.size
}

Column.prototype.getInfos = function () {
  return {
    size: this.size,
    align: this.align
  }
}
