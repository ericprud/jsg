#!/usr/bin/env node

function getCommandlineOptions () {
  "use strict";
  if (process.argv.length < 4)
    throw "Usage: "+process.argv[1]+" <JSG file> <JSON file..>";
  var version = require('../package.json').version;
  return {
    schema: process.argv[2],
    data: process.argv.slice(3)
  };
}

var cli = module.exports;

cli.main = function cliMain (opts) {
  "use strict";
  var opts = opts || {};
  var fs = require("fs");

  var Parser = require("./jsg.js");
  var Schema = require("./json-grammar.js");
  var p = Parser.parse(fs.readFileSync(opts.schema, "utf8"));
  // console.log(JSON.stringify(p, null, "  "));
  var s = Schema(p);
  // console.log(s.htmlSerializer().serialize());
  process.exitCode = opts.data.reduce((acc, data) => {
    var errors = s.validator().validate(JSON.parse(fs.readFileSync(data, "utf8")))
    if (errors.length)
      console.log((opts.data.length > 1 ? data + ":" : "") + "errors:", errors);
    acc = acc || (errors.length === 0 ? 0 : 1);
  }, 0);
}

if (require.main === module) {
    var opts = getCommandlineOptions();
    cli.main(opts);
}
