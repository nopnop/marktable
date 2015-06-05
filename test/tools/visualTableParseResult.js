var clc        = require('cli-color')
var format = require('util').format

module.exports = visualTableParseResult;

function visualTableParseResult(infos) {
  return format('TABLE range:[%s-%s] (%s %s %s %s) \n%s',
    infos.offset,
    infos.offsetEnd,
    clc.red.inverse('caption'),
    clc.blue.inverse('headers'),
    clc.green.inverse('columns'),
    clc.yellow.inverse('rows'),
      clc.red.inverse(infos.caption || '')
    + clc.blue.inverse(infos.headers || '')
    + clc.green.inverse(infos.columns || '')
    + clc.yellow.inverse(infos.rows || '')
  )
}
