var Parser = require("./jsg.js");
var FS = require('fs');
//var Assert = require("assert");
var OBJ = ">";
var EXP = "="

function Missing (attr, obj) {
  var ret = Error("Expected \"" + attr + "\" in " + obj);
  ret.type = "Missing";
  ret.object = obj;
  ret.attribute = attr;
  return ret;
}

function Unexpected (attr, obj) {
  var ret = Error("Unexpected \"" + attr + "\": \"" + DumpObject(obj[attr]) + "\" in " + DumpObject(obj));
  Error.captureStackTrace(ret, Unexpected);
  ret.type = "Unexpected";
  ret.object = obj;
  ret.attribute = attr;
  return ret;
}
// thrower for inline conditionals
function throwUnexpected (attr, obj) {
  var e = Unexpected(attr, obj);
  Error.captureStackTrace(e, throwUnexpected);
  throw e;
}

var DumpObject = require("util").inspect;

function Expected (attr, value, obj) {
  var msg =
    "Expected \"" + attr + "\"" +
    (value === undefined ? "" : " to equal \"" + value + "\"") +
    (!obj ? "" : " in " + DumpObject(obj));
  var ret = Error(msg);
  ret.type = "unexpected";
  ret.object = obj;
  ret.attribute = attr;
  ret.value = DumpObject(value);
  return ret;
}

function ExpectedType (attr, type) {
  var msg =
    "Expected \"" + attr + "\" to be of JSON type \"" + type + "\"";
  var ret = Error(msg);
  ret.type = "unexpectedType";
  ret.attribute = attr;
  ret.type = type;
  return ret;
}

function prepend (errors, prefix) {
  return errors.map(e => {
    e.message = "Testing \"" + prefix + "\": " + e.message;
    return e;
  });
}

function Epsilon (obj) {
  var ret = Expected("expected " + JSON.stringify(elt) + " to be empty.");
  ret.type = "Epsilon";
  ret.object = obj;
  return ret;
}

function NoMatching999 (attr, values, obj) {
  var msg = !obj ?
    "Expected \"" + attr + "\" to equal \"" + value + "\"" :
    "Expected \"" + attr + "\": \"" + obj[attr] + "\" to equal \"" + value + "\" in " + obj;
  var ret = Error(msg);
  ret.type = "NoMatching";
  ret.object = obj;
  ret.attribute = attr;
  ret.value = value;
  return ret;
}

function novel (elt, key, known) {
  return known.indexOf(key) === -1 ? elt[key] : undefined;
}

function reportUnknowns (elt, known) {
  var errors = [];
  var unexpected = known.reduce(function (ret, ob) {
    var i = ret.indexOf(ob);
    if (i !== -1) {
      ret.splice(i, 1);
    }
    return ret;
  }, Object.keys(elt));
  if (unexpected.length !== 0) {
    unexpected.forEach(function (u) {
      errors.push(Unexpected(u, elt));
    });
  }
  return errors;
}

function toJSG (expr) {
  switch (expr.type) {
  case "or":
    return expr.exprs.map(disjunct => {
      return toJSG(disjunct);
    }).join(" | ");
  case "reference":
    return expr.id + expr.card;
  case "propertyEnumeration":
    return "("+expr.ids.join("|")+"):"+expr.propertyType;
  case "property":
    return expr.id + ":" + expr.propertyType;
  default: throw Error("toJSG: unknown type: " + expr.type);
  }
}

function Schema (schema) {
  return {
    validator: function () {
      return {
        validateProductionOrConstant: function (elt, ft, known, lead) {
          var _validator = this;
          if (ft[0] === "\"") { // constant value
            if (elt === ft.slice(1, -1)) {
              return [];
            } else {
              return [Expected(elt, ft.slice(1, -1))];
            }
          }
          var refd = schema.map[ft];
          if (refd === undefined)
            throw Error("no definition for " + JSON.stringify(ft));
          if (refd.type === "object") {
            return this.validateObject(elt, ft, lead);
          } else if (refd.type === "nonObject") {
            return this.validateExpr(elt, refd.expr, known, lead);
          } else if (refd.type === "terminal") {
            // JSG only supports lexical constraints for now.
            if (typeof elt === "number" || typeof elt === "boolean")
              elt = ""+elt;
            if (typeof elt !== "string")
              return [ExpectedType(DumpObject(elt), "string")]
            if (!elt.match(RegExp(refd.regexp))) {
              return [Expected(elt, refd.regexp)];
            }
            return [];
          } else if (refd.type === "map") {
            return Object.keys(elt).reduce(function (ret, from) {
              return ret.concat(_validator.validateProductionOrConstant(from, refd.from, known, lead+EXP)).
                concat(_validator.validateExpr(elt[from], refd.to, known, lead+EXP));
            }, []);
          } else {
            throwUnexpected("type", refd);
          }
        },
        validateType: function (elt, t, known, lead) {
          var _validator = this;
          if (t === ".") {
            return [];
          } else if (typeof t !== "object") {
            return _validator.validateProductionOrConstant(elt, t, known, lead);
          } else if (t.type === "reference") {
            return _validator.validateProductionOrConstant(elt, t.id, known, lead);
          } else if (t.type === "typeChoices") {
            // console.log(t);
            var subKnown;
            var subErrors;
            for (var i = 0; i < t.choices.length; ++i) { // for(;;) for early return
              var disj = t.choices[i];
              subKnown = known.slice();
              subErrors = this.validateProductionOrConstant(elt, disj, subKnown, lead);
              if (subErrors.length === 0) {
                return [];
              }
            }
            return [Error("validateType: no matching choice testing " + JSON.stringify(elt) + " against " + t.choices.join("|"))];
          } else if (t.type === "array") {
            return elt.reduce(function (ret, e) {debugger;
              return ret.concat(_validator.validateExpr(e, t.of, known, lead+EXP));
            }, []);
          } else if (t.type === "map") {
            return Object.keys(elt).reduce(function (ret, from) {
              return ret.concat(_validator.validateProductionOrConstant(from, t.from, known, lead+EXP)).
                concat(_validator.validateExpr(elt[from], t.to, known, lead+EXP));
            }, []);
          } else {
            throwUnexpected("type", t);
          }
        },
        validateProperty: function (elt, prop, known, lead, propName) {
          if (prop.type === "epsilon") {
            return elt === undefined ? [] : [Unexpected(propName, elt)];
          }
          if (elt === undefined) {
            if (false && prop.card === "?") {
              return [];
            } else {
              return [Expected(propName, undefined, elt)];
            }
          }
          known.push(propName);
          return this.validateType(elt, prop.propertyType, known, lead, propName);
        },
        validatePropertyEnumeration: function (elt, prop, known, lead) {
            var subKnown;
            var subErrors;
            for (var i = 0; i < prop.ids.length; ++i) { // for(;;) for early return
              var disj = prop.ids[i];
              subKnown = known.slice();
              subErrors = this.validateProperty(novel(elt, disj, known), prop, subKnown, lead, disj);
              if (disj in elt) {
                known.push(disj)
              }
              if (subErrors.length === 0) {
                return [];
              }
            }
            return [Error("No matching enum testing " + JSON.stringify(elt) + " against " + JSON.stringify(prop))];
        },
        validateReference: function (elt, nob, known, lead) {
          return prepend(this.validateProductionOrConstant(elt, nob.id, known, lead), nob.id);
        },
        validatePropertyList: function (elt, list, known, lead) {
          var _validator = this;
          var errors = [];
          list.forEach(function (li) {
            errors = errors.concat(prepend(_validator.validateExpr(elt, li, known, lead+EXP), li.id));
            // console.log(lead, "T      choice testing ", elt, " for ", li);
            // var t = _validator.validateExpr(elt, li, known, lead+EXP);
            // var disposition = t.length === 0 ? "PASSED" : "FAILED";
            // console.log(lead, disposition, " choice testing ", elt, " for ", li, " yielded ", t);
            // errors = errors.concat(t);
          });
          return errors;
        },
        validateEpsilon: function (ep) {
          return "<span class=\"comment\">/* empty */</span>";
        },
        validateExpr: function (elt, expr, known, lead) {
          var _validator = this;
          // console.log(lead, expr);

          function testCard (test) {
            var matched = 0; // for reference(?), property(?|*) and propertyEnumeration(?|*)
            var lastErrors;
            var lastKnown;
            do {
              lastKnown = known.length;
              lastErrors = test();
              if (known.length !== lastKnown) {
                ++matched;
              }
            } while (expr.card === "*" && known.length !== lastKnown && lastErrors.length === 0);
            if (known.length !== lastKnown) {
              return lastErrors;
            }
            if (matched === 1 ||
                expr.card === "?" && matched === 0 ||
                expr.card === "*") {
              return [];
            } else {
              return  expr.card === "" ? lastErrors : [Error("unexpected " + matched + " matching " + JSON.stringify(expr))]
            }
          }

          switch (expr.type) {
            // reference, property and propertyEnumeration can have a cardinality
          case "reference":
            return testCard(function () {
              return _validator.validateReference(elt, expr, known, lead+EXP);
            });

          case "property":
//                known.push(expr.id);
            return testCard(function () {
              return _validator.validateProperty(novel(elt, expr.id, known), expr, known, lead, expr.id);
            });

          case "propertyEnumeration":
            return testCard(function () {
              return _validator.validatePropertyEnumeration(elt, expr, known, lead+EXP);
            });

          case "propertyList":
            return _validator.validatePropertyList(elt, expr.exprs, known, lead);

          case "or":
            var subKnown;
            var subErrors = [];
            for (var i = 0; i < expr.exprs.length; ++i) { // for(;;) for early return
              var disj = expr.exprs[i];
              subKnown = known.slice();
              subErrors.push(_validator.validateExpr(elt, disj, subKnown, lead));
              if (subErrors.slice(-1)[0].length === 0) {
                subKnown.slice(known.length).forEach(function (i) { known.push(i); }) // concatonate into existing array.
                return [];
              }
            }
            return [Error("No matching disjunction testing " + JSON.stringify(elt) +
                          " against " + toJSG(expr) + "\n" +
                          subErrors.map(function (errors) {
                            return errors.map(function (e) {
                              return e.message.split(/\n/).map(function (s) {
                                return "│ " + s;
                              }).join("\n");
                            }).join(",\n");
                          }).join("\n├──────\n") +
                          "\n└──────")];

          case "epsilon":
            known.push(expr.id) // !!! nuke?
            return reportUnknowns(elt, known);

          default:
            throwUnexpected("type", expr);
          }
        },
        validateObject: function (elt, as, leadp) {
          var _validator = this;
          var errors = [];
          function expect(val, testStr) {// console.log(val, testStr);
            if (!val)
              errors.push(testStr);
          }
          var lead = leadp + as+OBJ;
          if (typeof elt !== "object")
            return [ExpectedType(elt, "object")]
          expect(elt instanceof Object, `${DumpObject(elt)} instanceof Object`);
          expect(as !== undefined, `${as} !== undefined`);
          var defn = schema.map[as];
          var known = schema.ignore ? schema.ignore.slice() : [];
          expect(defn.type === "object", `${DumpObject(defn.type)} === "object"`);
          expect(defn !== undefined, `${DumpObject(defn)} !== undefined`);
          if (schema.discriminator) {
            expect(schema.discriminator in elt, `schema.discriminator in ${DumpObject(elt)}`);
            if (elt[schema.discriminator] !== as) { return [Expected(schema.discriminator, as, elt)]; }
            known.push(schema.discriminator);
          }
          errors = errors.concat(this.validateExpr(elt, defn.expr, known, lead));
          // console.log(lead, "known:", known);
          // console.log(lead, "shown:", Object.keys(elt));
          errors = errors.concat(reportUnknowns(elt, known));
          return errors;
        },
        validate: function (elt) {
          // return this.validateObject(elt, schema.start, "");
          return this.validateProductionOrConstant(elt, schema.start, [], "");
        }
      };
    },
    jsonSerializer: function (options) {
      var ret = [];
      function prop (p) {
        return "\""+p+"\"";
      }
      function simple (pz, obj, prefix) {
        if (pz.constructor !== Array)
          pz = [pz];
        var pushme = [];
        pz.forEach(p => {
          if (p in obj)
            pushme.push(prop(p) + ":" + JSON.stringify(obj[p]) + ",");
        });
        if (pushme.length)
          ret.push((prefix ? prefix : "") + pushme.join(""));
      }
      return {
        serialize: function () {
          // return JSON.stringify(schema);
          simple(["type", "discriminator", "ignore"], schema);
          simple("order", schema);
          ret.push(prop("map") + ":{");
          Object.keys(schema.map).forEach(label => {
            var dfn = schema.map[label];
            simple(["id", "type"], dfn, "  "+prop(label)+":{");
            switch (dfn.type) {
            case "object":
              dumpExpr(dfn.expr);
              break;
            case "nonObject":
              break;
            case "terminal":
              break;
            default:
              throw Error("unexpected type \""+dfn.type+"\" in map");
            }
            function dumpExpr (expr) {
              switch (expr.type) {
              case "Epsilon":
                var lastline = ret[ret.length-1];
                ret[ret.length-1] = lastline.spice(0, -1);
                break;
              }
            }
            ret.push("  }");
          });
          ret.push("}");
          return "{\n  " + ret.join("\n  ") + "\n}";
        }
      };
    },
    htmlSerializer: function (options) {
      function extend (base) {
        if (!base) base = {};
        for (var i = 1, l = arguments.length, arg; i < l && (arg = arguments[i] || {}); i++)
          for (var name in arg)
            base[name] = arg[name];
        return base;
      }

      options = extend({ wrap: 80, descriptions: false, examples: false }, options);
      function aan (s, cls) { // return: a str or an str
        return ("aeiou".indexOf(s[0]) === -1 ? "A " : "An ") + "<span class=\""+cls+"\">" + s + "</span> ";
      }

      return {
        serializeProductionOrConstant: function (ft) {
          if (ft[0] === "\"") {
            return "<span class=\"literal\">"+ft+"</span>";
          }
          var dt = 
            schema.map[ft].type === "object" ? "objref" :
            schema.map[ft].type === "nonObject" ? "nobref" :
            schema.map[ft].type === "terminal" ? "trmref" :
            throwUnexpected("type", schema.map[ft]);
          var anchor = schema.map[ft].type === "nonObject" ? "#dfn-" + ft : "#dfn-" + ft;
          return "<a class=\"" + dt + "\" href=\"" + anchor + "\">" + ft + "</a>";
        },
        describeProductionOrConstant: function (ft) {
          if (ft[0] === "\"") {
            return "<span class=\"literal\">"+ft+"</span>";
          }
          var dt =
            schema.map[ft].type === "object" ? "objref" :
            schema.map[ft].type === "nonObject" ? "nobref" :
            schema.map[ft].type === "terminal" ? "trmref" :
            throwUnexpected("type", schema.map[ft]);
          var anchor = schema.map[ft].type === "nonObject" ? "#dfn-" + ft : "#dfn-" + ft;
          return "<a class=\"" + dt + "\" href=\"" + anchor + "\">" + ft + "</a>";
        },
        serializeType: function (t) {
          var _htmlSerializer = this;
          if (typeof t !== "object")
            return _htmlSerializer.serializeProductionOrConstant(t);
          if (t.type === "reference")
            return _htmlSerializer.serializeProductionOrConstant(t.id);
          if (t.type === "typeChoices")
            return "(" + t.choices.map(function (ti) {
              return _htmlSerializer.serializeProductionOrConstant(ti);
            }).join(" | ") + ")";
          if (t.type === "array")
            return "[" + _htmlSerializer.serializeExpr(t.of) + "]";
          if (t.type === "map")
            return "{" + _htmlSerializer.serializeProductionOrConstant(t.from) + "-&gt;" + _htmlSerializer.serializeExpr(t.to) + "}";
          throwUnexpected("type", t);
        },
        describeType: function (t) {
          var _htmlSerializer = this;
          if (typeof t !== "object")
            return _htmlSerializer.describeProductionOrConstant(t);
          if (t.type === "typeChoices")
            return "(" + t.choices.map(function (ti) {
              return _htmlSerializer.describeProductionOrConstant(ti);
            }).join(" | ") + ")";
          if (t.type === "array")
            return "a list of " + _htmlSerializer.describeProductionOrConstant(t.of) + "s";
          if (t.type === "map")
            return "a map from " + _htmlSerializer.describeProductionOrConstant(t.from) + " to " + _htmlSerializer.describeProductionOrConstant(t.to) + "";
          throwUnexpected("type", t);
        },
        serializeProperty: function (prop) {
          return "<span class=\"param\">" + prop.id + "</span>:" + this.serializeType(prop.propertyType) + prop.card;
        },
        cardWords: function (card) {
          return card === "?" ? "an optional " : card === "*" ? "any number of " : "";
        },
        describeProperty: function (prop) {
          return "<code>" + prop.id + "</code>: " + this.cardWords(prop.card) + this.describeType(prop.propertyType);
        },
        serializePropertyEnumeration: function (prop) {
          return "("+prop.ids.
            map(function (s) { return "<span class=\"param\">\""+s+"\"</span>"; }).
            join("|")+")" + ":" + this.serializeType(prop.propertyType) + prop.card;
        },
        describePropertyEnumeration: function (prop) {
          return this.cardWords(prop.card) + "one of ("+prop.ids.
            // map(function (s) { return "<span class=\"literal\">\""+s+"\"</span>"; }).
            join(", ")+")" + ":" + this.describeType(prop.propertyType);
        },
        serializeReference: function (ref) {
          return this.serializeProductionOrConstant(ref.id) + ref.card;
        },
        describeReference: function (ref) {
          return this.describeProductionOrConstant(ref.id) + ref.card;
        },
        serializePropertyList: function (list) {
          var _htmlSerializer = this;
          return list.map(function (li) {
            return _htmlSerializer.serializeExpr(li);
          }).join(" ");
        },
        describePropertyList: function (list) {
          var _htmlSerializer = this;
          return list.map(function (li, ord, l) {
            return (ord === 0 ? "" : ord === l.length-1 ? ", and " : ", ") +  _htmlSerializer.describeExpr(li);
          }).join("");
        },
        serializeOr: function (expr) {
          var _htmlSerializer = this;
          return expr.exprs.map(function (oi) {
            return _htmlSerializer.serializeExpr(oi);
          }).join(" | ");
        },
        describeOr: function (expr) {
          var _htmlSerializer = this;
          return "either:" + expr.exprs.map(function (oi) { // @@@ add multi-line
            return "<br /> ‣ " + _htmlSerializer.describeExpr(oi);
          }).join("");
        },
        serializeEpsilon: function (ep) {
          return "<span class=\"comment\">/* empty */</span>";
        },
        describeEpsilon: function (ep) {
          return "no additional properties";
        },
        serializeExpr: function (expr, outer) {
          var _htmlSerializer = this;
          return expr.type === "reference" ? this.serializeReference(expr) :
            expr.type === "property" ? this.serializeProperty (expr) :
            expr.type === "propertyEnumeration" ? this.serializePropertyEnumeration(expr) :
            expr.type === "propertyList" ? this.serializePropertyList (expr.exprs) :
            expr.type === "or" ? (outer ? "" : "(") + this.serializeOr(expr) + (outer ? "" : ")") :
            expr.type === "epsilon" ? this.serializeEpsilon (expr) :
            throwUnexpected("type", expr);
        },
        describeExpr: function (expr, outer) {
          var _htmlDescriber = this;
          return expr.type === "reference" ? this.describeReference(expr) :
            expr.type === "property" ? this.describeProperty (expr) :
            expr.type === "propertyEnumeration" ? this.describePropertyEnumeration(expr) :
            expr.type === "propertyList" ? this.describePropertyList (expr.exprs) :
            expr.type === "or" ? (outer ? "" : "(") + this.describeOr(expr) + (outer ? "" : ")") :
            expr.type === "epsilon" ? this.describeEpsilon (expr) :
            throwUnexpected("type", expr);
        },
        serialize: function () {
          var _htmlSerializer = this;
          var needTerminalsHeading = true;
          var ret = schema.order.map(function (id) {
            var production = schema.map[id];
            var example = "";
            if (options.examples) {
              if (production.id in options.examples) {
                example = "<tr class=\"example\"><td></td><td class=\"example\" colspan=\"2\">"+options.examples[production.id]+"</td></tr>\n";
              } else {
                console.warn("no example for " + production.id);
              }
            }
            if (production.type === "object" || production.type === "nonObject") {
              var x = production.type === "object" ?
              { cls: "obj", open: "{", close: "}",  ishas: "has a <code>type</code>: <span class=\"literal\">\""+production.id+"\"</span>, " } :
              { cls: "nob", open: "=", close: ";", ishas: "is " };
              var description = options.descriptions ? "<tr class=\"description\"><th></th><td class=\"description\" colspan=\"2\">"+aan(production.id, x.cls)+x.ishas+_htmlSerializer.describeExpr(production.expr, true)+".</td></tr>\n" : "";
              var t = "<tr class=\""+x.cls+"\"><th id=\"dfn-" + production.id + "\" class=\""+x.cls+"\">" + production.id + "</th><td>" + x.open + "</td><td>" + _htmlSerializer.serializeExpr(production.expr, true) + " " + x.close + "</td></tr>\n";
              if (production.expr.type !== "or" || t.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "").length < options.wrap) {
                return t + description + example;
              }
              var rows = production.expr.exprs;
              var rowspan = " rowspan=\"" + rows.length + "\"";
              return "<tr class=\""+x.cls+"\"><th id=\"dfn-" + production.id + "\" class=\""+x.cls+"\">" + production.id + "</th><td>" + x.open + "</td><td>" + _htmlSerializer.serializeExpr(rows[0]) + " " + x.close + "</td></tr>\n" +
                rows.slice(1).map(function (r, ord) {
                  var semi = ord === rows.length - 2 ? " ;" : "";
                  return "    <tr><th></th><td>|</td><td>" + _htmlSerializer.serializeExpr(r) + semi + "</td></tr>\n"
                }).join("") + description + example;
            } else if (production.type === "terminal") {
              var heading = "";
              if (needTerminalsHeading) {
                heading = "<tr><th></th><th colspan=\"2\" style=\"text-align: left;\">Terminals</th></tr>\n";
                needTerminalsHeading = false;
              }
              return heading + "<tr class=\"trm\"><th id=\"dfn-"+production.id+"\" class=\"trm\">" + production.id + "</th><td>:</td><td>" + production.regexp + "</td></tr>\n" + example;
            } else {
              throw Unexpected("type", production);
            }
          }).map(function (s) { return "  " + s; });
          return "<table>\n" + ret.join("") + "</table>\n";
        }
      };
    }
  };
}

module.exports = Schema;

