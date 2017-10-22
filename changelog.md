Changelog
=========

v0.1.1 - Wise Puppy (2017-10-22) 
----------------------------------------------------------------------



v0.1.0 - Coldblooded Dolphin (2015-06-05) 
----------------------------------------------------------------------

  - refactor: Remove dependency on huge package like underscore / underscore.string
  - refactor: Debug output
  - refactor: rename Table#handle() to Table.handleParseResult()
  - refactor: Parser refactoring, and more tests
  - doc: Update license
  - test: Remove .only
  - test: refactor test
  - test: Update coverage
  - test: Move acceptance test
  - test: Add some automatic fixture
  - test: Add watch on fixture file to kill test process on change
  - test: Add some acceptance tests
  - test: Add base for acceptance test
  - feat: Add Table#getInfos()
  - feat: Add TBody#getInfos()
  - feat: Add Column.getInfos()
  - feat: Add Column.ALIGN_DEFAULT
  - feat: Add Colgroup#getInfos()
  - feat: Add default column alignement constatn
  - fix: \Z escape two times


v0.0.1 - Effusive Snake (2014-06-03) 
----------------------------------------------------------------------

  - doc: Update readme with functionalities and basic usage
  - doc: Add basic demo
  - doc: Update readme
  - fix: Do not use slugify in the parser (should be used in html generator)
  - fix: TBody splitter with dot and only when there is more than one
  - fix: Remove console.log
  - fix: Do not search secondary caption
  - fix: Row: use push() instead of addCell()
  - fix: ExportS the right object
  - refactor: Update main API with a .parse() and .transform()
  - refactor: Change main marktable main API with a replace callback
  - refactor: Rename index to offset
  - refactor: Space
  - refactor: Expose basic marketable api and Class
  - refactor: Export Table in a module
  - refactor: Export TBody in a module
  - refactor: Export MultilineRow in a module
  - refactor: Export Row in a module
  - refactor: Export Row in a module
  - refactor: Export Cell in a module
  - refactor: Export Colgroup in a module
  - refactor: Export Column in a module
  - refactor: Export Document in a module
  - refactor: Extract reusable regex in a module
  - refactor: Cleanup
  - feat: Add Colgroup#getFullSize() and Colgroup#getFullFormatedSize()
  - feat: Add Table#getRawTable()
  - feat: Match TBody (a line with only dot)


