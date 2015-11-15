#!/usr/bin/env node

var Parser = require("./jsg.js");
var Schema = require("./json-grammar.js");

function getCommandlineOptions () {
  "use strict";
  var program = require('commander');
 
  program.
    version(require('../package.json').version).
    option('-d, --descriptions', 'add textual descriptions').
    option('-w, --wrap <n>', 'wrap ORs wider than', parseInt).
    option('-e, --examples <file>', 'add examples drawn from <file>').
    parse(process.argv);
  return {
    schema: program.args[0],
    options: program
  };
}

var jsgToHtml = module.exports;

jsgToHtml.main = function jsgToHtmlMain (opts) {
  "use strict";
  var opts = opts || {};
  var fs = require("fs");

  var p = Parser.parse(fs.readFileSync(opts.schema, "utf8"));
  var s = Schema(p);
  console.log(s.htmlSerializer(opts.options).serialize());
}

if (require.main === module) {
    var opts = getCommandlineOptions();
    jsgToHtml.main(opts);
}
