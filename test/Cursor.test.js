/* global describe it */

var marktable = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var fixtures = require('./fixtures/index')
var Table = marktable.Table
var Cursor = marktable.Cursor

describe('marktable', function () {
  describe('Cursor', function () {
    describe('#fromPoint()', function () {
      it('should update cursor position from a buffer point object relative to table offset', function () {
        var table = new Table()
        var src = fixtures.get(111).read().source
        table.parse(src)
        var cursor = new Cursor(table)
        cursor.fromPoint([3, 1])
      })
    })
  })
})
