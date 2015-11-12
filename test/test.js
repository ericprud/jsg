var FS = require("fs");
var expect = require("chai").expect;
var Parser = require("../lib/jsg.js");
var Schema = require("../lib/json-grammar.js");

describe ("A grammar", function () {

  [["ShExJ.jsg", "ShExJ_all.json", true],
   ["ShExJ.jsg", "empty.json", true],
   ["ShExJ.jsg", "bad-noType.json", undefined],
   ["ShExJ.jsg", "bad-wrongType.json", false],
   ["ShExJ.jsg", "bad-unknowProperty.json", false]].forEach(function (t) {
     var p, s, errors;
     it("should correctly parse schema '" + t[0] + "'." , function () {
       p = Parser.parse(FS.readFileSync(t[0], "utf8"));
     });
     // console.log(JSON.stringify(p, null, 2));
     it("should the schema '" + t[0] + "'." , function () {
       s = Schema(p);
     });
     // console.log(s.htmlSerializer().serialize());
     it("should validate '" + t[1] + "' against '" + t[0] + "' and " + (t[2] ? "pass" : "fail") + "." , function () {
       try {
	 errors = s.validator().validate(JSON.parse(FS.readFileSync(t[1], "utf8")));
	 // console.log("errors:", errors);
	 expect(errors.length === 0).to.equal(t[2]);
       } catch (e) {
	 expect(errors).to.equal(undefined);
       }
     });
   });
});

