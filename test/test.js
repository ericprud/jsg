var FS = require("fs");
var Path = require("path");
var expect = require("chai").expect;
var Parser = require("../lib/jsg.js");
var Schema = require("../lib/json-grammar.js");

var Testdir = Path.relative("", __dirname);

describe ("", function () {

  [["ShExJ.jsg", "ShExJ_all.json", true],
   ["ShExJ.jsg", "empty.json", true],
   ["ShExJ.jsg", "bad-noType.json", undefined],
   ["ShExJ.jsg", "bad-wrongType.json", false],
   ["ShExJ.jsg", "bad-unknowProperty.json", false]].forEach(function (t) {
     var schema = Path.join(Testdir, t[0]);
     var data = Path.join(Testdir, t[1]);
     var p, s, errors;
     it(`JSG should correctly parse schema '${schema}'.` , function () {
       p = Parser.parse(FS.readFileSync(schema, "utf8"));
     });
     // console.log(JSON.stringify(p, null, 2));
     it(`JSG should construct a schema from '{$schema}'.` , function () {
       s = Schema(p);
     });
     // console.log(s.htmlSerializer().serialize());
     it(`Validating '${data}' against '${schema}' should ${(t[2] ? "pass" : "fail")}.` ,
        function () {
          try {
	    errors = s.validator().validate(JSON.parse(FS.readFileSync(data, "utf8")));
	    // console.log("errors:", errors);
	    expect(errors.length === 0).to.equal(t[2]);
          } catch (e) {
	    expect(errors).to.equal(undefined);
          }
        });
   });
});

