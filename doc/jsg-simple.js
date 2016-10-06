// jsg-simple - Simple JSG invoker for HTML.
// Copyright 2016 Eric Prud'hommeux
// Release under MIT License.

function load (selector, obj, func) {
  $(selector).empty();
  Object.keys(obj).forEach(k => {
    var li = $('<li><a href="#">' + k + '</li>');
    li.on("click", () => {
      func(k, obj[k], li);
    });
    $(selector).append(li);
  });
}

function clear () {
  $("#schema textarea").val("");
  $("#schema .status").text(" ");

  $("#data textarea").val("");
  $("#data .status").text(" ");
  $("#data .passes, #data .fails").hide();
  $("#data .passes p:first").text("");
  $("#data .fails p:first").text("");
  $("#data .passes ul, #data .fails ul").empty();

  $("#results").text("").css("border-left", "none");
}

function pickSchema (name, schemaTest, elt) {
  $("#schema textarea").val(schemaTest.schema);
  $("#schema .status").text(name);

  $("#data textarea").val("");
  $("#data .status").text(" ");
  $("#data .passes, #data .fails").show();
  $("#data .passes p:first").text("Passing:");
  load("#data .passes ul", schemaTest.passes, pickData);
  $("#data .fails p:first").text("Failing:");
  load("#data .fails ul", schemaTest.fails, pickData);

  $("#results").text("").css("border-left", "none");
}

function pickData (name, dataTest, elt) {
  $("#data textarea").val(JSON.stringify(dataTest, null, "  "));
  $("#data .status").text(name);
  validate();
}

function validate () {
  try {
    var schemaText = $("#schema textarea").val();
    var parsed = parser.parse(schemaText);
    var schema = Schema(parsed);
    var dataText = $("#data textarea").val();
    if (dataText) {
      var data = JSON.parse(dataText);
      var errors = schema.validator().validate(data);
      if (errors.length)
        $("#results").text(errors.join("\n")).css("border-left", "thick solid orange");
      else
        $("#results").text("data conforms to schema").css("border-left", "thick solid green");
    } else {
      $("#results").text("valid schema").css("border-left", "thick solid green");
    }
  } catch (e) {
    $("#results").text(e).css("border-left", "thick solid red");
  }
}

$("#data .passes, #data .fails").hide();
$("#data .passes ul, #data .fails ul").empty();
$("#validate").on("click", validate);
$("#clear").on("click", clear);
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
        "1card25":{
          "type": "Schema",
          "shapes":{
            "http://a.example/S1": {
              "type": "Shape",
              "expression": {
                "type": "TripleConstraint",
                "predicate": "http://a.example/p1",
                "min": 2, "max": 5
              }
            }
          }
        },
        "1bnodeRefORRefMinlength": {
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
                      "type": "ShapeAnd",
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
        }
      }
    }
  };
  load("#schema .examples ul", demos, pickSchema);
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

shexjSchema = `.TYPE type; # All objects have a type property corresponding to the production name, e.g. "Schema"

Schema           { prefixes:{PREFIX->IRI}? base:IRI? startActs:[SemAct]? start:shapeExpr? shapes:{shapeLabel->shapeExpr}? }
shapeExpr        = ShapeOr | ShapeAnd | ShapeNot | NodeConstraint | Shape | ShapeRef | ShapeExternal;
ShapeOr          { shapeExprs:[shapeExpr] }
ShapeAnd         { shapeExprs:[shapeExpr] }
ShapeNot         { shapeExpr:shapeExpr }
Shape            { virtual:BOOL? closed:BOOL? extra:[IRI]? expression:tripleExpr? inherit:[shapeLabel]? semActs:[SemAct]? }
ShapeExternal    {  }
ShapeRef         { reference:IRI } # should be a TERM or some such
SemAct           { name:IRI code:STRING? }
tripleExpr       = EachOf | SomeOf | TripleConstraint | Inclusion ;
EachOf           { expressions:[tripleExpr] min:INTEGER? max:(INTEGER|"*")? semActs:[SemAct]? annotations:[Annotation]? }
SomeOf           { expressions:[tripleExpr] min:INTEGER? max:(INTEGER|"*")? semActs:[SemAct]? annotations:[Annotation]? }
Inclusion        { include:shapeLabel }
TripleConstraint { inverse:BOOL? negated:BOOL? predicate:IRI valueExpr:shapeExpr? min:INTEGER? max:(INTEGER|"*")? semActs:[SemAct]? annotations:[Annotation]? }
NodeConstraint   { nodeKind:("iri"|"bnode"|"nonliteral"|"literal")? datatype:IRI? xsFacet* values:[valueSetValue]? }
Annotation       { predicate:IRI object:objectValue }

xsFacet          = stringFacet | numericFacet ;
stringFacet      = (length|minlength|maxlength):INTEGER | pattern:STRING ;
numericFacet     = (mininclusive|minexclusive|maxinclusive|maxexclusive):numericLiteral
                 | (totaldigits|fractiondigits):INTEGER ;
shapeLabel       = IRI|BNODE ;
numericLiteral   = INTEGER|DECIMAL|DOUBLE ;
valueSetValue    = objectValue|Stem|StemRange ;
objectValue      = IRI|RDFLiteral ;
Stem             { stem:IRI } # StemRange with exclusions
StemRange        { stem:(IRI|Wildcard) exclusions:[valueSetValue]? }
Wildcard         {  }
RDFLiteral       = SIMPLE_LITERAL|DATATYPE_LITERAL|LANG_LITERAL ;

# Terminals used in productions:
PREFIX           : PN_PREFIX? ; # <http://www.w3.org/TR/turtle/#grammar-production-PNAME_NS> - ":"
IRI              : (PN_CHARS | '.' | ':' | '/' | '\\\\' | '#' | '@' | '%' | '&' | UCHAR)* ; # <http://www.w3.org/TR/turtle/#grammar-production-IRIREF> - "<>"s
BNODE            : '_:' (PN_CHARS_U | [0-9]) ((PN_CHARS | '.')* PN_CHARS)? ; # <http://www.w3.org/TR/turtle/#grammar-production-BLANK_NODE_LABEL>
BOOL             : "true" | "false" ; # JSON boolean tokens
INTEGER          : [+-]? [0-9] + ; # <http://www.w3.org/TR/turtle/#grammar-production-INTEGER>
DECIMAL          : [+-]? [0-9]* '.' [0-9] + ; # <http://www.w3.org/TR/turtle/#grammar-production-DECIMAL>
DOUBLE           : [+-]? ([0-9] + '.' [0-9]* EXPONENT | '.' [0-9]+ EXPONENT | [0-9]+ EXPONENT) ; # <http://www.w3.org/TR/turtle/#grammar-production-DOUBLE>
SIMPLE_LITERAL   : '"' ([^"\\\\\\r\\n] | '\\\\"')* '"' ; # JSON string with '"' at beginning and end
DATATYPE_LITERAL : SIMPLE_LITERAL "^^" IRI ; # JSON string with '"' at beginning, an unescaped '"' followed by '^^' and an IRI
LANG_LITERAL     : SIMPLE_LITERAL LANGTAG ; # JSON string with '"' at beginning, an unescaped '"' followed by '@' and a Turtle LANGTAG                   
STRING           : .* ;

# Terminals use only in other terminals:
PN_PREFIX        : PN_CHARS_BASE ((PN_CHARS | '.')* PN_CHARS)? ;
PN_CHARS_BASE    : [A-Z] | [a-z] | [\\u00C0-\\u00D6] | [\\u00D8-\\u00F6]
                 | [\\u00F8-\\u02FF] | [\\u0370-\\u037D] | [\\u037F-\\u1FFF]
                 | [\\u200C-\\u200D] | [\\u2070-\\u218F] | [\\u2C00-\\u2FEF]
                 | [\\u3001-\\uD7FF] | [\\uF900-\\uFDCF] | [\\uFDF0-\\uFFFD]
                 | [\\u10000-\\uEFFFF] ;
PN_CHARS         : PN_CHARS_U | '-' | [0-9] | '\\u00B7' | [\\u0300-\\u036F] | [\\u203F-\\u2040] ;
PN_CHARS_U       : PN_CHARS_BASE | '_' ;
UCHAR            : '\\\\u' HEX HEX HEX HEX
                 | '\\\\U' HEX HEX HEX HEX HEX HEX HEX HEX ;
HEX              : [0-9] | [A-F] | [a-f] ;
EXPONENT 	 : [eE] [+-]? [0-9]+ ;
LANGTAG          : '@' [a-zA-Z] + ('-' [a-zA-Z0-9] +)* ;
`; // '

prepareDemos();


