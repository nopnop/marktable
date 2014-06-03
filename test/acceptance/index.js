var readFileSync = require('fs').readFileSync
var join         = require('path').join


exports.list = function() {

}

exports.read = function (filename) {
  var src    = readFileSync(join(__dirname, filename)).toString();
  var result = [];
  var stack  = [];
}
