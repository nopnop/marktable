
// Reusable regex parts

exports.tableRow     = '[^\n]*?\\|[^\n]*?[\n]*'
exports.firstRow     = '\\S+.*?\\|.*?[\n]*'
exports.tableRows    = '([\n]?' + exports.tableRow +')'
exports.tableCaption = '\\[.*?\\][ \\t]*[\n]*'
exports.tableDivider = '[\\|\\-\\+\\:\\.][ \\-\\+\\|\\:\\.]*\\|[ \\-\\+\\|\\:\\.]*'
exports.wholeTable   =
    '('+ exports.tableCaption +')?'	// Optional caption
  + '('+ exports.firstRow				    // First line must start at beginning
  + '('+ exports.tableRow +')*?)?'	 // Header Rows
  + exports.tableDivider			       // Divider/Alignment definitions
  + exports.tableRows+'+'			      // Body Rows
  + '('+ exports.tableCaption +')?'	// Optional caption (TODO: Not used)
