var FS = require("fs");
var Path = require("path");
var expect = require("chai").expect;
var Parser = require("../lib/jsg.js");
var Schema = require("../lib/json-grammar.js");

var Testdir = Path.relative("", __dirname);

describe ("", function () {

  [["ShExJ.jsg", "ShExJ_all.json", true],
   ["ShExJ.jsg", "empty.json", true],
   ["ShExJ.jsg", "bad-noType.json", "type"],
   ["ShExJ.jsg", "bad-wrongType.json", false],
   ["ShExJ.jsg", "bad-unknowProperty.json", "unknownProperty"]].forEach(function (t) {
     var schema = Path.join(Testdir, t[0]);
     var data = Path.join(Testdir, t[1]);
     var boolResult = t[2] === true ? "pass" : "fail";
     var errMatch = t[2] !== true && t[2] !== false ? t[2] : "";
     var result = `${boolResult}` + (errMatch.length ? ` with an error on "${errMatch}"` : "");
     var p, s, errors;
     it(`JSG should correctly parse schema '${schema}'.` , function () {
       p = Parser.parse(FS.readFileSync(schema, "utf8"));
     });
     // console.log(JSON.stringify(p, null, 2));
     it(`JSG should construct a schema from '{$schema}'.` , function () {
       s = Schema(p);
     });
     // console.log(s.htmlSerializer().serialize());
     it(`Validating '${data}' against '${schema}' should ${result}.` ,
        function () {
          try {
	    errors = s.validator().validate(JSON.parse(FS.readFileSync(data, "utf8")));
          } catch (e) {
	    expect(e).to.equal("");
            errors = null;
          }
	  // console.log("errors:", errors);
          if (errors !== null) {
	    expect(errors.length === 0).to.equal(boolResult === "pass");
            if (boolResult === "fail" && errMatch.length !== 0 && errors.length !== 0)
              expect(errors[0].attribute).to.equal(errMatch);
          }
        });
   });
});

