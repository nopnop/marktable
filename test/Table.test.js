/* global describe it */

var marktable = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var pluck = require('lodash.pluck')
var expect = require('expect.js')
var fixtures = require('./fixtures/index')
var debug = require('debug')('marktable:test')
var viewTable = require('./tools/visualTableParseResult')
var Table = marktable.Table
var Column = marktable.Column

describe('marktable', function () {
  describe('Table', function () {
    describe('#parse()', function () {
      it('should parse one basic table in a source', function () {
        var table = new Table()
        var src = fixtures.get(101).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': undefined, 'caption': undefined,
          'headers': 1, 'columns': 2, 'bodies': 1,
          'rows': 1, 'lines': 1
        })
      })

      it('should parse basic table with borders', function () {
        var table = new Table()
        var src = fixtures.get(102).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': undefined, 'caption': undefined,
          'headers': 1, 'columns': 2, 'bodies': 1,
          'rows': 1, 'lines': 1
        })
      })

      it('should parse table with more than one header line', function () {
        var table = new Table()
        var src = fixtures.get(103).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': undefined, 'caption': undefined,
          'headers': 2, 'columns': 2, 'bodies': 1,
          'rows': 2, 'lines': 2
        })
      })

      it('should parse table with alignements', function () {
        var table = new Table()
        var src = fixtures.get(104).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': undefined, 'caption': undefined,
          'headers': 1, 'columns': 4, 'bodies': 1,
          'rows': 1, 'lines': 1
        })
        expect(pluck(table.colgroup.getInfos().columns, 'align'))
          .to.be.eql([
          Column.ALIGN_DEFAULT,
          Column.ALIGN_LEFT,
          Column.ALIGN_CENTER,
          Column.ALIGN_RIGHT
        ])
      })

      it('should parse table with multi-line-cells', function () {
        var table = new Table()
        var src = fixtures.get(105).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': undefined, 'caption': undefined,
          'headers': 1, 'columns': 1, 'bodies': 1,
          'rows': 2, 'lines': 4
        })
      })

      it('should parse table with multi-bodies', function () {
        var table = new Table()
        var src = fixtures.get(106).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': undefined, 'caption': undefined,
          'headers': 1, 'columns': 1, 'bodies': 3,
          'rows': 6, 'lines': 6
        })
      })

      it('should parse table with caption and id', function () {
        var table = new Table()
        var src = fixtures.get(109).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': 'tableID', 'caption': 'My table',
          'headers': 1, 'columns': 2, 'bodies': 1,
          'rows': 1, 'lines': 1
        })
      })

      it('should parse table without headers', function () {
        var table = new Table()
        var src = fixtures.get(110).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': undefined, 'caption': undefined,
          'headers': 0, 'columns': 2, 'bodies': 1,
          'rows': 1, 'lines': 1
        })
      })

      it('should parse complex table', function () {
        var table = new Table()
        var src = fixtures.get(111).read().source
        var result = table.parse(src)
        debug('Result:\n', viewTable(result))
        expect(table.getInfos()).to.be.eql({
          'id': 'tableID',
          'caption': 'A table with many of the marktable functionalities',
          'headers': 2, 'columns': 4, 'bodies': 4,
          'rows': 8, 'lines': 12
        })
      })
    })
  })
})
