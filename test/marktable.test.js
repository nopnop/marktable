/* jshint undef: false, unused: false */

var marktable  = process.env.COVERAGE ? require('../lib-cov/marktable') : require('../lib/marktable')
var expect     = require('expect.js')
var fixtures   = require('./fixtures/index')
var lpad       = require('underscore.string').lpad
var debug      = require('debug')('marktable:test')
var chokidar   = require('chokidar')
var clc        = require('cli-color')

var Document   = marktable.Document
var Table      = marktable.Table

// Use a watcher to kill test on fixture change
var watcher    = new chokidar.FSWatcher();
watcher.on('change', function(file) {
  console.log('Change on ', file)
  process.exit(0)
})

function debugMatchingInfo(infos) {
  debug('TABLE range:[%s-%s] (%s %s %s %s)',
    infos.offset,
    infos.offsetEnd,
    clc.red.inverse('caption'),
    clc.blue.inverse('headers'),
    clc.green.inverse('columns'),
    clc.yellow.inverse('rows'),
    '\n'+clc.red.inverse(infos.caption || '')
    + clc.blue.inverse(infos.headers || '')
    + clc.green.inverse(infos.columns || '')
    + clc.yellow.inverse(infos.rows || '')
  )
}

describe('marktable', function(){




  describe('Table', function() {
    describe('#parse()', function() {
      it('should parse one table in a source', function() {
        var table  = new Table();
        var src    = fixtures.get(101).read().source;
        var result = table.parse(src);
        debugMatchingInfo(result)
        // console.log(table.toMarkdown())
      })
    })
  })


  describe('Automatic tests', function() {
    fixtures.where({auto:true})
      .forEach(function(test) {
        watcher.add(test.file)
        it(lpad(test.id,3,'0') + '. ' + test.spec,function() {
          var fixture = test.read();
          var result  = marktable(fixture.source);
          debug(result);
          expect(result.trim().split('\n'))
            .to.eql(fixture.expected.trim().split('\n'))
        })
      })
  })

})
