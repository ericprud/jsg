function resize () {
  var width = $(window).width();
  var size = parseFloat($("#schema").css("font-size"));
  var cols = width/size/2;
  var stuff = `${$("#schema").attr("cols")} -> ${cols} width:${width} font-size:${size}`;
  $("#schema, #data").attr("cols", cols).parent().find("p").text(stuff);
//  alert(`${$("#schema").attr("cols")} ${width}, ${size}, ${width / size}`);
}

var addrSchema = `address { street:NAME no:NUM? }
NAME : .*;
NUM : [0-9]+[a-e]?;
`;

var perAddrSchema = `person { name:NAME addrs:[address]? }
address { street:NAME no:NUM? }
NAME : .*;
NUM : [0-9]+[a-e]?;
`;

var shexjSchema = `.TYPE type; # All objects have a type property corresponding to the production name, e.g. "Schema"

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

var demos = {
  "address": {
    schema: addrSchema,
    passes: {
      "complete": { "street":"Elm", "no":"123b" },
      "just name": { "street":"Elm" },
    },
    fails: {
      "missing street": { no: 123 },
      "extra property": { "street":"Elm", "no":"123b", "x": "y" }
    }
  },
  "person with address": {
    schema: perAddrSchema,
    passes: {
      "no addrs": { name: "Bob" },
      "empty addresses": { name: "Bob", addrs: [] },
      "1 address": { name: "Bob", addrs: [
        { "street":"Elm", "no":"123b" }
      ] },
      "2 addresses": { name: "Bob", addrs: [
        { "street":"Elm", "no":"123b" },
        { "street":"Forest", "no":"18" }
      ] },
    },
    fails: {
      "missing name": { addrs: [
        { "street":"Elm", "no":"123b" }
      ] },
      "bad address": { name: "Bob", addrs: [
        { "street":"Elm", "no":"123b", "x": "y" }
      ] },
      "bad last addresses": { name: "Bob", addrs: [
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
},
    }
  },
};

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

$("#data .passes ul, #data .fails ul").empty();
load("#schema .examples ul", demos, pickSchema);

function pickSchema (name, schemaTest, elt) {
  $("#results").text("");
  $("#data textarea").val("");
  $("#schema .status").text(name);
  $("#schema textarea").val(schemaTest.schema);
  $("#data .passes p:first").text("Passing:");
  load("#data .passes ul", schemaTest.passes, pickData);
  $("#data .fails p:first").text("Failing:");
  load("#data .fails ul", schemaTest.fails, pickData);
}

function pickData (name, dataTest, elt) {
  $("#data .status").text(name);
  $("#data textarea").val(JSON.stringify(dataTest, null, "  "));
  validate();
  // load("#data .examples", data.passes, dfill);
}

$("#validate").on("click", validate);

function validate () {
  var schemaText = $("#schema textarea").val();
  var parsed = parser.parse(schemaText);
  var schema = Schema(parsed);
  var data = JSON.parse($("#data textarea").val());
  var errors = schema.validator().validate(data);
  $("#results").text(errors);
}

$("#clear").on("click", clear);

function clear () {
  $("#schema textarea").val("");
  $("#data textarea").val("");
  $("#data .passes p:first").text("");
  $("#data .fails p:first").text("");
  $("#data .passes ul, #data .fails ul").empty();
  $("#schema .status").text(" ");
  $("#data .status").text(" ");
  $("#results").text("");
}

