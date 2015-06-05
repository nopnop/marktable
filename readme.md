# Marktable
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/nopnop/marktable.svg?style=flat&branch=master
[travis-url]: https://travis-ci.org/nopnop/marktable
[npm-image]: https://img.shields.io/npm/v/marktable.svg?style=flat
[npm-url]: https://npmjs.org/package/marktable
[downloads-image]: https://img.shields.io/npm/dm/marktable.svg?style=flat
[downloads-url]: https://npmjs.org/package/marktable


**ALPHA: Dev ongoing - Not usable yet**

> Parse markdown table, edit and format them to markdown or html

# Functionalities

- Parse and objectify [gfm](https://help.github.com/articles/github-flavored-markdown)
- Support multiline cell
- Support colspan
- Support table headers
- Support column alignment
- Support multi table body
- Format table to markdown

### Todo or ongoing
- Full unit test
- Table editing
  - add/remove cell, row, column, tbody
  - merge cell, row, tbody
  - move/copy row
- Track one or many *pseudo-cursor* position before and after table transformations
- Format table to html
- Escape in-content pipe
- Stream API
- Convert CSV to markdown table
- Convert Google Spreadsheet to markdown table
- ...

# Installation

```shell
npm install --save marktable
```

# API

## Basic usage

See too `demo/basic.js` for more basic examples

```javascript
var marktable = require('marktable')

// Simple gfm table with alignements
console.log(marktable([
  '|Header 1| Header 2 |',
  '|-:|:-:|',
  '| 42 |',
  '| | o |'
].join('\n')))


// Yield:
/*
| Header 1 | Header 2 |
|---------:|:--------:|
|       42 |          |
|          |     o    |
*/

```

**TODO: Rest of the API**

# Credit

- Inspired by [MultiMarkdown](http://fletcherpenney.net/multimarkdown/) project and its [table parser implementation](https://github.com/fletcher/MultiMarkdown)

# Related

Some related projects, with different goal and usages, that may match you needs:

- [gfm-table](https://www.npmjs.org/package/gfm-table): Generate GFM style table
- [ascii-table](https://www.npmjs.org/package/ascii-table): Easy tables for your console data
- [columnify](https://www.npmjs.org/package/columnify): Render data in text columns, supports in-column text-wrap
- [convert-text-table](https://www.npmjs.org/package/convert-text-table): Convert ascii tables to json arrays
- [tablify](https://www.npmjs.org/package/tablify): Quick and painless printing of tabular data



# License

The MIT license (see LICENSE.md)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
