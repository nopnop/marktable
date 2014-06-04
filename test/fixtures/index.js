var readFileSync = require('fs').readFileSync
var readdirSync  = require('fs').readdirSync
var resolve      = require('path').resolve
var humanize     = require('underscore.string').humanize
var _            = require('underscore')


var tests = [];


exports.add   = function(test) { tests.push(test) }
exports.get   = function(id)   { return _.findWhere(tests, {id:id}) }
exports.all   = function()     { return tests }
exports.where = function(prop) { return _.where(tests, prop) }


readdirSync(__dirname)
  .forEach(function(filename) {
    if(!/\.md$/.test(filename)) return;

    var auto = /\.auto\.md$/.test(filename) ? true : false;

    exports.add({
      id  : parseInt(filename.slice(0, 3)),
      spec: humanize(filename.slice(4, (auto ? -8 : -4))),
      auto: auto,
      read: function() {
        return exports.read(resolve(__dirname, filename))
      }
    })
  })


exports.read = function (filepath) {
  var lines  = readFileSync(resolve(__dirname, filepath))
    .toString()
    .split('\n');

  var status = 0;
  var result = {
    comment  : '',
    source   : [],
    expected : []
  }

  lines.forEach(function(line) {
    switch(status) {
      case 0:
        if(!/^>/.test(line)) return;
        result.comment = line.slice(1).trim();
        status = 1;
        break;
      case 1:
        if(/^## SOURCE/.test(line))   return (status = 2);
        break;
      case 2:
        if(/^## EXPECTED/.test(line)) return (status = 3);
        result.source.push(line)
        break;
      case 3:
        result.expected.push(line)
    }
  })

  result.source   = result.source.join('\n');
  result.expected = result.expected.join('\n');

  return result;
}
