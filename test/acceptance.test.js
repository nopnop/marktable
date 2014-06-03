
/* jshint undef: false, unused: false */

var marktable  = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var expect     = require('expect.js')
var acceptance = require('./acceptance/index')

describe('marktable acceptance tests', function(){


  acceptance.list().forEach(function(test) {
    it(test.should,function() {
      var fixture = test.read();
      expect(marktable(fixture.source))
        .to.equal(fixture.expected)
    })
  })

  // it('should pass all acceptance tests', function() {
  //
  // })

})
