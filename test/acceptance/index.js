var readFileSync = require('fs').readFileSync
var readdirSync  = require('fs').readdirSync
var resolve      = require('path').resolve
var humanize     = require('underscore.string').humanize


exports.list = function() {
  return readdirSync(__dirname)
    .filter(function(filename) {
      return /\.md$/.test(filename);
    })
    .map(function(filename) {
      return {
        should: 'Should ' + humanize(filename.slice(4,-3)),
        read: function() {
          return read(resolve(__dirname, filename))
        }
      }
    })
}

function read(filepath) {
  var lines  = readFileSync(resolve(__dirname, filepath))
    .toString()
    .split('\n');

  var status = 0;
  var result = {
    comment   : '',
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
