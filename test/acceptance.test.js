/* global describe it */

var marktable = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var expect = require('expect.js')
var fixtures = require('./fixtures/index')
var padleft = require('lodash.padleft')

describe('marktable', function () {
  describe('Acceptance tests', function () {
    fixtures.where({auto: true})
      .forEach(function (test) {
        it(padleft(test.id, 3, '0') + '. ' + test.spec, function () {
          var fixture = test.read()
          var result = marktable(fixture.source)
          expect(result.trim().split('\n'))
            .to.eql(fixture.expected.trim().split('\n'))
        })
      })
  })
})
