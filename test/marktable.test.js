/* jshint undef: false, unused: false */

var marktable  = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var expect     = require('expect.js')
var fixtures   = require('./fixtures/index')
var lpad       = require('underscore.string').lpad

describe('marktable', function(){


  describe('Automatic tests', function() {
    fixtures.where({auto:true})
      .forEach(function(test) {
        it(lpad(test.id,3,'0') + '. ' + test.spec,function() {
          var fixture = test.read();
          expect(marktable(fixture.source))
            .to.eql(fixture.expected)
        })
      })
  })

})
