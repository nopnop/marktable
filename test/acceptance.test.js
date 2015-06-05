/* global describe it */

var marktable = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var expect = require('expect.js')
var fixtures = require('./fixtures/index')
var padleft = require('lodash.padleft')
var chokidar = require('chokidar')

// Use a watcher to kill test on fixture change
var watcher = new chokidar.FSWatcher()
watcher.on('change', function (file) {
  console.log('Change on ', file)
  process.exit(0)
})

describe('marktable', function () {
  describe('Acceptance tests', function () {
    fixtures.where({auto: true})
      .forEach(function (test) {
        watcher.add(test.file)
        it(padleft(test.id, 3, '0') + '. ' + test.spec, function () {
          var fixture = test.read()
          var result = marktable(fixture.source)
          expect(result.trim().split('\n'))
            .to.eql(fixture.expected.trim().split('\n'))
        })
      })
  })
})
