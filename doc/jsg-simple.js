// jsg-simple - Simple JSG invoker for HTML.
// Copyright 2016 Eric Prud'hommeux
// Release under MIT License.

function sum (s) { // cheap way to identify identical strings
  return s.replace(/\s/g, "").split("").reduce(function (a,b){
    a = ((a<<5) - a) + b.charCodeAt(0);
    return a&a
  },0);
}

function load (selector, obj, func, listItems, side, str) {
  $(selector).empty();
  Object.keys(obj).forEach(k => {
    var li = $('<li><a href="#">' + k + '</li>');
    li.on("click", () => {
      func(k, obj[k], li, listItems, side);
    });
    listItems[side][sum(str(obj[k]))] = li;
    $(selector).append(li);
  });
}

function clearData () {debugger;
  $("#data textarea").val("");
  $("#data .status").text(" ");
  $("#results").text("").removeClass("passes fails error");
}

function clearAll () {
  $("#schema textarea").val("");
  $("#schema .status").text(" ");
  $("#schema li.selected").removeClass("selected");
  clearData();
  $("#data .passes, #data .fails").hide();
  $("#data .passes p:first").text("");
  $("#data .fails p:first").text("");
  $("#data .passes ul, #data .fails ul").empty();
}

function pickSchema (name, schemaTest, elt, listItems, side) {
  if ($(elt).hasClass("selected")) {
    clearAll();
  } else {
    $("#schema textarea").val(schemaTest.schema);
    $("#schema .status").text(name);

    $("#data textarea").val("");
    $("#data .status").text(" ");
    $("#data .passes, #data .fails").show();
    $("#data .passes p:first").text("Passing:");
    load("#data .passes ul", schemaTest.passes, pickData, listItems, "data", function (o) { return JSON.stringify(o); });
    $("#data .fails p:first").text("Failing:");
    load("#data .fails ul", schemaTest.fails, pickData, listItems, "data", function (o) { return JSON.stringify(o); });

    $("#results").text("").removeClass("passes fails error");
    $("#schema li.selected").removeClass("selected");
    $(elt).addClass("selected");
  }
}

function pickData (name, dataTest, elt, listItems, side) {
  if ($(elt).hasClass("selected")) {
    clearData();
    $(elt).removeClass("selected");
  } else {
    $("#data textarea").val(JSON.stringify(dataTest, null, "  "));
    $("#data .status").text(name);
    $("#data li.selected").removeClass("selected");
    $(elt).addClass("selected");
    validate();
  }
}

function validate () {
  try {
    var schemaText = $("#schema textarea").val();
    // jsg set in ../lib/jsg.js
    var parsed = jsg.parse(schemaText);
    var schema = Schema(parsed);
    var dataText = $("#data textarea").val();
    if (dataText) {
      var data = JSON.parse(dataText);
      var errors = schema.validator().validate(data);
      if (errors.length)
        $("#results").text(errors.join("\n")).
        removeClass("passes error").addClass("fails");
      else
        $("#results").text("data conforms to schema").
        removeClass("fails error").addClass("passes");
    } else {
      $("#results").text("valid schema").
        removeClass("fails error").addClass("passes");
    }
  } catch (e) {
    var msg = typeof e === "object" && "message" in e ? e.message : e;
    $("#results").text(msg).
      removeClass("passes fails").addClass("error");
  }
}

$("#data .passes, #data .fails").hide();
$("#data .passes ul, #data .fails ul").empty();
$("#validate").on("click", validate);
$("#clear").on("click", clearAll);
// prepareDemos() is invoked after these variables are assigned:
var addrSchema, perAddrSchema, shexjSchema;

function prepareDemos () {
  var demos = {
    "address": {
      schema: addrSchema,
      passes: {
        "complete": { "street":"Elm", "no":"123b" },
        "just name": { "street":"Elm" },
      },
      fails: {
        "missing street": { "no": "123" },
        "extra property": { "street":"Elm", "no":"123b", "x": "y" },
        "misspelled property": { "street999":"Elm", "no":"123b" }
      }
    },
    "person with address": {
      schema: perAddrSchema,
      passes: {
        "no addrs": { "name": "Bob" },
        "empty addresses": { "name": "Bob", "addrs": [] },
        "1 address": { "name": "Bob", "addrs": [
          { "street":"Elm", "no":"123b" }
        ] },
        "2 addresses": { "name": "Bob", "addrs": [
          { "street":"Elm", "no":"123b" },
          { "street":"Forest", "no":"18" }
        ] },
      },
      fails: {
        "missing name": { "addrs": [
          { "street":"Elm", "no":"123b" }
        ] },
        "bad address": { "name": "Bob", "addrs": [
          { "street":"Elm", "no":"123b", "x": "y" }
        ] },
        "bad last addresses": { "name": "Bob", "addrs": [
          { "street":"Elm", "no":"123b" },
          { "no":"18" }
        ] },
      }
    },
    "ShExJ": {
      schema: shexjSchema,
      passes: {
        "ClinObs":
{
  "@context": "http://www.w3.org/ns/shex.jsonld",
  "type": "Schema",
  "start": "http://schema.example/ObservationShape",
  "shapes": [
    {
      "type": "ShapeDecl",
      "id": "http://schema.example/ObservationShape",
      "shapeExpr": {
        "type": "Shape",
        "expression": {
          "type": "EachOf",
          "expressions": [
            {
              "type": "TripleConstraint",
              "predicate": "http://hl7.org/fhir/status",
              "valueExpr": {
                "type": "NodeConstraint",
                "values": [
                  { "value": "preliminary" },
                  { "value": "final" }
                ]
              }
            },
            {
              "type": "TripleConstraint",
              "predicate": "http://hl7.org/fhir/subject",
              "valueExpr": "http://schema.example/PatientShape"
            }
          ]
        }
      }
    },
    {
      "type": "ShapeDecl",
      "id": "http://schema.example/PatientShape",
      "shapeExpr": {
      "type": "Shape",
        "expression": {
          "type": "EachOf",
          "expressions": [
            {
              "type": "TripleConstraint",
              "predicate": "http://hl7.org/fhir/name",
              "valueExpr": {
                "type": "NodeConstraint",
                "datatype": "http://www.w3.org/2001/XMLSchema#string"
              },
              "min": 0, "max": -1
            },
            {
              "type": "TripleConstraint",
              "predicate": "http://hl7.org/fhir/birthdate",
              "valueExpr": {
                "type": "NodeConstraint",
                "datatype": "http://www.w3.org/2001/XMLSchema#date"
              },
              "min": 0, "max": 1
            }
          ]
        }
      }
    }
  ]
}
,
        "IssueShape-EXTENDS":
{
  "type": "Schema",
  "shapes": [
    {
      "type": "ShapeDecl",
      "id": "http://a.example/IssueShape",
      "shapeExpr": {
        "type": "Shape",
        "closed": true,
        "expression": {
          "type": "EachOf",
          "expressions": [
            {
              "type": "TripleConstraint",
              "predicate": "http://ex.example/#reportedBy",
              "valueExpr": "http://a.example/PersonShape"
            },
            {
              "type": "TripleConstraint",
              "predicate": "http://ex.example/#reproducedBy",
              "valueExpr": "http://a.example/EmployeeShape",
              "min": 0,
              "max": 1
            }
          ]
        }
      }
    },
    {
      "type": "ShapeDecl",
      "id": "http://a.example/PersonShape",
      "abstract": true,
      "shapeExpr": {
        "type": "Shape",
        "expression": {
          "type": "EachOf",
          "expressions": [
            {
              "type": "OneOf",
              "expressions": [
                {
                  "type": "TripleConstraint",
                  "predicate": "http://xmlns.com/foaf/name",
                  "valueExpr": {
                    "type": "NodeConstraint",
                    "datatype": "http://www.w3.org/2001/XMLSchema#string"
                  }
                },
                {
                  "type": "EachOf",
                  "expressions": [
                    {
                      "type": "TripleConstraint",
                      "predicate": "http://xmlns.com/foaf/givenName",
                      "valueExpr": {
                        "type": "NodeConstraint",
                        "datatype": "http://www.w3.org/2001/XMLSchema#string"
                      },
                      "min": 1,
                      "max": -1
                    },
                    {
                      "type": "TripleConstraint",
                      "predicate": "http://xmlns.com/foaf/familyName",
                      "valueExpr": {
                        "type": "NodeConstraint",
                        "datatype": "http://www.w3.org/2001/XMLSchema#string"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "type": "TripleConstraint",
              "predicate": "http://xmlns.com/foaf/mbox",
              "valueExpr": {
                "type": "NodeConstraint",
                "nodeKind": "iri"
              }
            }
          ]
        }
      }
    },
    {
      "type": "ShapeDecl",
      "id": "http://a.example/UserShape",
      "shapeExpr": {
        "type": "Shape",
        "extends": [
          "http://a.example/PersonShape"
        ],
        "closed": true,
        "expression": {
          "type": "TripleConstraint",
          "predicate": "http://ex.example/#representative",
          "valueExpr": "http://a.example/EmployeeShape"
        }
      }
    },
    {
      "type": "ShapeDecl",
      "id": "http://a.example/RepShape",
      "abstract": true,
      "shapeExpr": {
        "type": "Shape",
        "expression": {
          "type": "TripleConstraint",
          "predicate": "http://xmlns.com/foaf/phone",
          "valueExpr": {
            "type": "NodeConstraint",
            "nodeKind": "iri"
          },
          "min": 1,
          "max": -1
        }
      }
    },
    {
      "type": "ShapeDecl",
      "id": "http://a.example/EmployeeShape",
      "shapeExpr": {
        "type": "Shape",
        "extends": [
          "http://a.example/PersonShape",
          "http://a.example/RepShape"
        ],
        "closed": true
      }
    }
  ],
  "@context": "http://www.w3.org/ns/shex.jsonld"
}
      },
      fails: {
        "misplaced attr":{
          "type": "Schema",
          "shapes":{
            "http://a.example/S1": {
              "type": "Shape", "max": 5,
              "expression": {
                "type": "TripleConstraint",
                "predicate": "http://a.example/p1",
                "min": 2
              }
            }
          }
        },
        "wrong type": {
          "type": "Schema",
          "shapes": {
            "http://a.example/S1": {
              "type": "Shape",
              "expression": {
                "type": "TripleConstraint",
                "predicate": "http://a.example/p1",
                "valueExpr": {
                  "type": "ShapeOr",
                  "shapeExprs": [
                    {
                      "type": "ShapeAnd",
                      "shapeExprs": [
                        {
                          "type": "NodeConstraint",
                          "nodeKind": "bnode"
                        },
                        {
                          "type": "ShapeRef",
                          "reference": "http://a.example/S1"
                        }
                      ]
                    },
                    {
                      "type": "Inclusion",
                      "shapeExprs": [
                        {
                          "type": "NodeConstraint",
                          "minlength": 5
                        },
                        {
                          "type": "ShapeRef",
                          "reference": "http://a.example/S1"
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        "short array": {
          "type": "Schema",
          "shapes": {
            "http://a.example/S1": {
              "type": "Shape",
              "expression": {
                "type": "TripleConstraint",
                "predicate": "http://a.example/p1",
                "valueExpr": {
                  "type": "ShapeAnd",
                  "shapeExprs": [
//                    { "type": "NodeConstraint", "nodeKind": "bnode" },
                    { "type": "ShapeRef", "reference": "http://a.example/S1" }
                  ]
                }
              }
            }
          }
        }
      }
    }
  };
  var listItems = {schema:{}, data:{}};
  load("#schema .examples ul", demos, pickSchema,
       listItems, "schema", function (o) {
         return o.schema;
       });
  var timeouts = { schema: undefined, data: undefined };
  function later (target, side) {
    if (timeouts[side])
      clearTimeout(timeouts[side]);

    timeouts[side] = setTimeout(() => {
      timeouts[side] = undefined;
      $("#"+side+" .selected").removeClass("selected");
      var curSum = sum($(target).val());
      if (curSum in listItems[side])
        listItems[side][curSum].addClass("selected");
    }, 250);
  }
  $("body").keyup(function (e) {
    var code = e.keyCode || e.charCode;
    if(e.ctrlKey && (code === 10 || code === 13)) // standards anyone?
      $("#validate").click();
  });
  $("#schema textarea").keyup(function (e) {
    later(e.target, "schema");
  });
  $("#data textarea").keyup(function (e) {
    later(e.target, "data");
  });
}

function prepareInterface () {
  // don't overwrite if we arrived here from going back for forth in history
  if ($("#schema textarea").val() !== "" || $("#data textarea").val() !== "")
    return;
  var iface = parseQueryString(location.search);

  var QueryParams = [{queryStringParm: "schema", location: $("#schema textarea")},
                     {queryStringParm: "data", location: $("#data textarea")}];
  QueryParams.forEach(input => {
    var parm = input.queryStringParm;
    if (parm in iface)
      iface[parm].forEach(text => {
        input.location.val(input.location.val() + text);
      });
  });

  $("h1").on("click", updateURL);

  /**
   *
   * location.search: e.g. "?schema=asdf&data=qwer&shape-map=ab%5Ecd%5E%5E_ef%5Egh"
   */
  function parseQueryString (query) {
    if (query[0]==='?') query=query.substr(1); // optional leading '?'
    var map   = {};
    query.replace(/([^&,=]+)=?([^&,]*)(?:[&,]+|$)/g, function(match, key, value) {
      key=decodeURIComponent(key);value=decodeURIComponent(value);
      (map[key] = map[key] || []).push(value);
    });
    return map;
  };

  /**
   * update location with a current values of some inputs
   */
  function updateURL () {
    var parms = QueryParams.map(input => {
      var parm = input.queryStringParm;
      return parm + "=" + encodeURIComponent(input.location.val());
    });
    var s = parms.join("&");
    window.history.pushState(null, null, location.origin+location.pathname+"?"+s);
  }
}
// Large constants with demo data which break syntax highlighting:
addrSchema = `address { street:NAME no:NUM? }
NAME : .*;
NUM : [0-9]+[a-e]?;
`;

perAddrSchema = `person { name:NAME addrs:[address]? }
address { street:NAME no:NUM? }
NAME : .*;
NUM : [0-9]+[a-e]?;
`;

shexjSchema = `# This is a JSON Grammar (JSG) file for the ShEx JSON format.
# The form "OBJNAME  { property:PROPTYPE ... }" matches an object of type OBJTYPE
# The form "RULENAME = NAME1 | NAME2 ..." matches any of NAMEn.
# the form "TERMNAME : "RegExp" matches any literal matching RegExp
# A PROPTYPE can be:
#   TERMINAL - a terminal, all caps in this example.
#   [PROPTYPE] - an array of PROPTYPE.
#   {TERMINAL->PROPTYPE} - a map from TERMINAL to PROPTYPE.
#   (PROPTYPE1 | PROPTYPE2...) - any of PROPTYPEn.

# All objects have a type property corresponding to the production name, e.g. "Schema"
.TYPE type - ObjectLiteral;

Schema           {
  "@context":"http://www.w3.org/ns/shex.jsonld" ?
  imports:[IRIREF+] ?
  startActs:[SemAct+] ?
  start:shapeExprOrRef ?
  shapes:[ShapeDecl+] ?
}
ShapeDecl        {
  id:shapeDeclLabel
  abstract:BOOL ?
  restricts:[shapeExprOrRef+] ?
  shapeExpr:shapeExpr
}

// Shape Expressions
shapeExpr        = ShapeOr | ShapeAnd | ShapeNot | NodeConstraint | Shape | ShapeExternal;
shapeExprOrRef   = shapeExpr | shapeDeclRef;
ShapeOr          { shapeExprs:[shapeExprOrRef{2,}] }
ShapeAnd         { shapeExprs:[shapeExprOrRef{2,}] }
ShapeNot         { shapeExpr:shapeExprOrRef }
shapeDeclRef     = shapeDeclLabel ;
shapeDeclLabel   = IRIREF | BNODE ;
NodeConstraint   {
  nodeKind:("iri"|"bnode"|"nonliteral"|"literal") ?
  datatype:IRIREF ?
  xsFacet *
  values:[valueSetValue+] ?
}
ShapeExternal    { }

# XML Schema facets
xsFacet          = stringFacet | numericFacet ;
stringFacet      = (length|minlength|maxlength):INTEGER | pattern:STRING flags:STRING? ;
numericFacet     = (mininclusive|minexclusive|maxinclusive|maxexclusive):numericLiteral
                 | (totaldigits|fractiondigits):INTEGER ;

numericLiteral   = INTEGER | DECIMAL | DOUBLE ;

# Value Sets
valueSetValue    = objectValue | IriStem | IriStemRange | LiteralStem
                 | LiteralStemRange | Language | LanguageStem | LanguageStemRange ;
objectValue      = IRIREF | ObjectLiteral ;
ObjectLiteral    { value:STRING language:STRING? type:STRING? }
IriStem          { stem:IRIREF } # IriStemRange with exclusions
IriStemRange     { stem:(IRIREF | Wildcard) exclusions:[IRIREF | IriStem+]? }
LiteralStem      { stem:STRING } # LiteralStemRange with exclusions
LiteralStemRange { stem:(STRING | Wildcard) exclusions:[STRING | LiteralStem+] }
Language         { languageTag: LANGTAG }
LanguageStem     { stem:(LANGTAG | EMPTY) }
LanguageStemRange{ stem:(LANGTAG | EMPTY | Wildcard) exclusions:[LANGTAG | LanguageStem+] }
Wildcard         {  }

Shape            {
  abstract:BOOL ?
  closed:BOOL ?
  extends:[shapeExprOrRef+] ?
  extra:[IRIREF+] ?
  expression:tripleExprOrRef ?
  semActs:[SemAct+] ?
  annotations:[Annotation+] ?
}

# Triple Expressions
tripleExpr       = EachOf | OneOf | TripleConstraint ;
tripleExprOrRef  = tripleExpr | tripleExprRef ;
EachOf           {
  id:tripleExprLabel ?
  expressions:[tripleExprOrRef{2,}]
  min:INTEGER ?
  max:INTEGER ?
  semActs:[SemAct+] ?
  annotations:[Annotation+] ?
}
OneOf            {
  id:tripleExprLabel ?
  expressions:[tripleExprOrRef{2,}]
  min:INTEGER ?
  max:INTEGER ?
  semActs:[SemAct+] ?
  annotations:[Annotation+] ?
}
TripleConstraint {
  id:tripleExprLabel ?
  inverse:BOOL ?
  predicate:IRIREF
  valueExpr:shapeExprOrRef ?
  min:INTEGER ?
  max:INTEGER ?
  semActs:[SemAct+] ?
  annotations:[Annotation+] ?
}
tripleExprRef    = tripleExprLabel ;
tripleExprLabel  = IRIREF | BNODE ;

SemAct           { name:IRIREF code:STRING? }
Annotation       { predicate:IRIREF object:objectValue }

# Terminals used in productions:
                 # <http://www.w3.org/TR/turtle/#grammar-production-IRIREF> - "<>"s
IRIREF           : (IRIREF_NO_U | '_' IRIREF_NO_COLON) IRIREF_ALL*;
                 # <http://www.w3.org/TR/turtle/#grammar-production-BLANK_NODE_LABEL>
BNODE            : '_:' (PN_CHARS_U | [0-9]) ((PN_CHARS | '.')* PN_CHARS)? ;
                 # JSON boolean tokens
BOOL             : "true" | "false" ;
                 # <http://www.w3.org/TR/turtle/#grammar-production-INTEGER>
INTEGER          : [+-]? [0-9]+ ;
                 # <http://www.w3.org/TR/turtle/#grammar-production-DECIMAL>
DECIMAL          : [+-]? [0-9]* '.' [0-9]+ ;
                 # <http://www.w3.org/TR/turtle/#grammar-production-DOUBLE>
DOUBLE           : [+-]? ([0-9]+ '.' [0-9]* EXPONENT | '.' [0-9]+ EXPONENT | [0-9]+ EXPONENT) ;
                 # <https://tools.ietf.org/search/bcp47>
LANGTAG          : [a-zA-Z]+ ('-' [a-zA-Z0-9]+)* ;
STRING           : .* ;
EMPTY            : '' ;

# Terminals use only in other terminals:
IRIREF_NO_U      : (IRIREF_CHARS | ':') ;
IRIREF_NO_COLON  : (IRIREF_CHARS | '_') ;
IRIREF_ALL       : (IRIREF_CHARS | ':' | '_') ;
IRIREF_CHARS     : [!#-9;=?-Z^a-z~] | PN_CHARS_EXT | DIACRITICALS | UCHAR ;
PN_CHARS_BASE    : [A-Z] | [a-z] | PN_CHARS_EXT ;
PN_CHARS_EXT     : [\u00C0-\u00D6] | [\u00D8-\u00F6]
                 | [\u00F8-\u02FF] | [\u0370-\u037D] | [\u037F-\u1FFF]
                 | [\u200C-\u200D] | [\u2070-\u218F] | [\u2C00-\u2FEF]
                 | [\u3001-\uD7FF] | [\uF900-\uFDCF] | [\uFDF0-\uFFFD]
                 | [\u10000-\uEFFFF] ;
PN_CHARS         : PN_CHARS_U | DIACRITICALS ;
PN_CHARS_U       : PN_CHARS_BASE | '_' ;
DIACRITICALS     : '-' | [0-9] | '\u00B7' | [\u0300-\u036F] | [\u203F-\u2040] ;
UCHAR            : '\\u' HEX HEX HEX HEX
                 | '\\U' HEX HEX HEX HEX HEX HEX HEX HEX ;
HEX              : [0-9] | [A-F] | [a-f] ;
EXPONENT 	 : [eE] [+-]? [0-9]+ ;` // '

prepareInterface();
prepareDemos();

