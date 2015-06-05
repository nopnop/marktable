var readFileSync = require('fs').readFileSync
var readdirSync = require('fs').readdirSync
var resolve = require('path').resolve
var where = require('lodash.where')
var findwhere = require('lodash.findwhere')

var tests = []

exports.add = function (test) { tests.push(test) }
exports.get = function (id) { return findwhere(tests, {id: id}) }
exports.all = function () { return tests }
exports.where = function (prop) { return where(tests, prop) }

readdirSync(__dirname)
  .forEach(function (filename) {
    if (!/\.md$/.test(filename)) return

    var auto = Boolean(/\.auto\.md$/.test(filename))

    var file = resolve(__dirname, filename)
    exports.add({
      id: parseInt(filename.slice(0, 3), 10),
      file: file,
      spec: filename.slice(4, (auto ? -8 : -4)),
      auto: auto,
      read: function () {
        return exports.read(file)
      }
    })
  })

exports.read = function (filepath) {
  var lines = readFileSync(resolve(__dirname, filepath))
    .toString()
    .split('\n')

  var status = 0
  var result = {
    comment: '',
    source: [],
    expected: []
  }

  lines.forEach(function (line) {
    switch (status) {
      case 0:
        if (!/^>/.test(line)) return
        result.comment = line.slice(1).trim()
        status = 1
        break
      case 1:
        if (/^## SOURCE/.test(line)) {
          status = 2
          return status
        }
        break
      case 2:
        if (/^## EXPECTED/.test(line)) {
          status = 3
          return status
        }
        result.source.push(line)
        break
      case 3:
        result.expected.push(line)
    }
  })

  result.source = result.source.join('\n')
  result.expected = result.expected.join('\n')

  return result
}
