#!/usr/bin/env node

/**
 * OPTIONS:
 *   -k: stop after first file reports errors (like make -k)
 *   -h: print schema as HTML
 *   -j: print schema as JSON object
 *   -c: export schema as C++ classes
 *   -l: list failing files but don't show the errors
 *   -v: report passing files
 */

function getCommandlineOptions () {
  "use strict";
  var ret = { };
  const knownArgs = {
    "-k": "stopAfterFirstErrors",
    "-h": "printAsHTML",
    "-j": "printAsJSON",
    "-c": "printAsCPP",
    "-l": "onlyListFailures",
    "-v": "reportPassingFiles"
  };
  while (process.argv.length > 2 && process.argv[2] in knownArgs) {
    ret[knownArgs[process.argv[2]]] = true;
    process.argv.splice(2, 1);
  }
  if (process.argv.length < 3 || Object.keys(process.argv).length === 0 && process.argv.length < 4)
    throw "Usage: "+process.argv[1]+" [-h] [-j] [-l] [-v] [-k] <JSG file> <JSON file..>";
  ret.schema = process.argv[2];
  ret.data = process.argv.slice(3);
  return ret;
}

var cli = module.exports;

cli.main = function cliMain (opts) {
  "use strict";
  var opts = opts || {};
  var fs = require("fs");

  var Parser = require("./jsg.js");
  var Schema = require("./json-grammar.js");
  var schemaText = fs.readFileSync(opts.schema, "utf8");
  var p = opts.schema.endsWith(".json") ? JSON.parse(schemaText) : Parser.parse(schemaText);
  // console.log(JSON.stringify(p, null, "  "));
  var s = Schema(p);
  // console.log(s.htmlSerializer().serialize());
  var errorMarker = opts.onlyListFailures ? "failed" : "errors:";
  if (opts.printAsJSON)
    console.log(s.jsonSerializer({}).serialize());
  if (opts.printAsHTML)
    console.log(s.htmlSerializer({}).serialize());
  if (opts.printAsCPP)
    console.log(s.cppSerializer({}).serialize());
  process.exitCode = opts.data.reduce((acc, data) => {
    if (!acc || !opts.stopAfterFirstErrors) {
      var errors = s.validator().validate(JSON.parse(fs.readFileSync(data, "utf8")))
      if (errors.length)
	console.log(((opts.data.length > 1 || opts.reportPassingFiles) ?
		     data + ": " :
		     "") + errorMarker, opts.onlyListFailures ? "" : errors);
      else if (opts.reportPassingFiles)
	console.log(data + " passed");
      acc = acc || (errors.length === 0 ? 0 : 1);
    }
    return acc;
  }, 0);
}

if (require.main === module) {
    var opts = getCommandlineOptions();
    cli.main(opts);
}
