#!/usr/bin/env node

var Parser = require("./jsg.js");
var Schema = require("./json-grammar.js");
var FS = require("fs");

function warn (x) {
    console.warn(require("util").inspect(x, false, null));
}

function getCommandlineOptions () {
  "use strict";
  var cli = require('commander');
 
  cli.
    version(require('../package.json').version).
    option('-d, --descriptions', 'add textual descriptions').
    option('-w, --wrap <n>', 'wrap ORs wider than', parseInt).
    option('-e, --examples <file>', 'add examples drawn from <file>').
    parse(process.argv);
  if (cli.examples) {
    var DOMParser = require('@xmldom.xmldom').DOMParser;
    var doc = new DOMParser().parseFromString(FS.readFileSync(cli.examples, "utf8"));
    cli.examples = {}; // replace filename with read data.
    var trs = doc.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; ++i) {
      var tr = trs[i];
      var val = "";
      var bits = tr.getElementsByTagName("td")[0].childNodes;
      for (var b = 0; b < bits.length; ++b) {
        val += bits[b].toString();
      }
      cli.examples[tr.getElementsByTagName("th")[0].textContent] = val;
    }
  }
  return {
    schema: cli.args[0],
    options: cli
  };
}

var jsgToHtml = module.exports;

jsgToHtml.main = function jsgToHtmlMain (opts) {
  "use strict";
  var opts = opts || {};

  var p = Parser.parse(FS.readFileSync(opts.schema, "utf8"));
  var s = Schema(p);
  console.log(s.htmlSerializer(opts.options).serialize());
}

if (require.main === module) {
    var opts = getCommandlineOptions();
    jsgToHtml.main(opts);
}
