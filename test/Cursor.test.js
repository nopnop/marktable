/* jshint undef: false, unused: false */

var marktable  = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var _          = require('underscore')
var expect     = require('expect.js')
var fixtures   = require('./fixtures/index')
var lpad       = require('underscore.string').lpad
var debug      = require('debug')('marktable:test')
var viewTable  = require('./tools/visualTableParseResult')
var Document   = marktable.Document
var Table      = marktable.Table
var Column     = marktable.Column
var Cursor     = marktable.Cursor


describe('marktable', function(){

  describe('Cursor', function() {

    describe('#fromPoint()', function() {
      it('should update cursor position from a buffer point object relative to table offset', function() {
        var table  = new Table();
        var src    = fixtures.get(111).read().source;
        var result = table.parse(src);
        var cursor = new Cursor(table);
        cursor.fromPoint([3,1])
      })
    })

  })

})
