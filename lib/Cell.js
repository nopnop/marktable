// Import
var Column = require('./Column')
var pad = require('lodash.pad')
var padleft = require('lodash.padleft')
var padright = require('lodash.padright')

// Export
module.exports = Cell

/**
 * A table cell
 *
 * @param {String} content Cell content
 * @param {Object} options
 *        Cell option:
 *          - colspan {integer} how many collapsed columns (default: 1)
 *          - header  {boolean} is a header cell (default: false)
 */
function Cell (content, options) {
  options = options || {}
  this.content = content
  this.colspan = options.colspan || 1
  this.header = options.header === true
}

/**
 * @return {Cell} A clone of this Cell
 */
Cell.prototype.clone = function () {
  return new Cell(this.content, {
    colspan: this.colspan,
    header: this.header
  })
}

/**
 * @return {integer} Cell content length (without whitespace from both ends)
 */
Cell.prototype.getContentSize = function () {
  return this.content.trim().length
}

/**
 * Generate a markdown formated Cell
 *
 * @param {String} align A Column aligment constants
 * @param {String} size  Pad result to this size
 * @return {String}
 */
Cell.prototype.toMarkdown = function (align, size) {
  var content = this.content.trim()
  size = size || content.length

  switch (align) {
    case Column.ALIGN_RIGHT:
      // content = pad(content, size, ' ', 'left')
      content = padleft(content, size, ' ')
      break
    case Column.ALIGN_CENTER:
      content = pad(content, size, ' ')
      break
    default:
      // content = pad(content, size, ' ', 'right')
      content = padright(content, size, ' ')
  }
  return ' ' + (content || ' ') + ' '
}
