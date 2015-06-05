/* jshint undef: false, unused: false */

var marktable  = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var expect     = require('expect.js')
var fixtures   = require('./fixtures/index')
var debug      = require('debug')('marktable:test')
var viewTable  = require('./tools/visualTableParseResult')
var Document   = marktable.Document
var Table      = marktable.Table
var Column     = marktable.Column


describe('marktable', function() {

})
