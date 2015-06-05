var marktable = require('../lib/marktable') // require('marktable')

// Simple gfm table
console.log(marktable([
  '|Foo|Bar|',
  '|-|',
  '| 42 |',
  ''
].join('\n')), '\n')

// Simple gfm table with alignements
console.log(marktable([
  '|Header 1| Header 2 |',
  '|-:|:-:|',
  '| 42 |',
  '| | o |',
  ''
].join('\n')), '\n')

// Colspan
console.log(marktable([
  '|Header 1| Header 2 |',
  '|-|',
  '| foo | bar |',
  '| One cell ||',
  ''
].join('\n')), '\n')

// Multiline
console.log(marktable([
  '|Long description|',
  '|:-:|',
  '| this |',
  '| is |',
  '| multiline |',
  '| cell |',
  '|-|',
  '| Another cell |',
  ''
].join('\n')), '\n')

/*
Yield:
| Foo | Bar |
|-----|-----|
| 42  |     |

| Header 1 | Header 2 |
|---------:|:--------:|
|       42 |          |
|          |     o    |

| Header 1 | Header 2 |
|----------|----------|
| foo      | bar      |
| One cell           ||

| Long description |
|:----------------:|
|       this       |
|        is        |
|     multiline    |
|       cell       |
| ---------------- |
|   Another cell   |
*/
