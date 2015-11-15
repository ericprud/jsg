var Parser = require("./jsg.js");
var FS = require('fs');
var Assert = require("assert");
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
  var ret = Error("Unexpected \"" + attr + "\": \"" + obj[attr] + "\" in " + obj);
  ret.type = "Unexpected";
  ret.object = obj;
  ret.attribute = attr;
  return ret;
}
// thrower for inline conditionals
function throwUnexpected (attr, obj) { throw Unexpected(attr, obj); }

function Expected (attr, value, obj) {
  var msg =
    "Expected \"" + attr + "\"" +
    (value === undefined ? "" : " to equal \"" + value + "\"") +
    (!obj ? "" : " in " + obj);
  var ret = Error(msg);
  ret.type = "unexpected";
  ret.object = obj;
  ret.attribute = attr;
  ret.value = value;
  return ret;
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

function Schema (schema) {
  return {
    validator: function () {
      return {
        validateLeafType: function (elt, ft, known, lead) {
          var _validator = this;
          if (ft[0] === "\"") {
            if (elt === ft.slice(1, -1)) {
              return [];
            } else {
              return [Expected(elt, ft.slice(1, -1))];
            }
          }
          var refd = schema.map[ft];
          if (refd.type === "object") {
            return this.validateObject(elt, ft, lead);
          } else if (refd.type === "nonObject") {
            return this.validateExpr(elt, refd.expr, known, lead);
          } else if (refd.type === "terminal") {
            if (!(""+elt).match(RegExp(refd.regexp))) {
              return [Expected(elt, refd.regexp)];
            }
            return [];
          } else {
            throwUnexpected("type", refd);
          }
        },
        validateType: function (elt, t, known, lead) {
          var _validator = this;
          if (typeof t !== "object") {
            return _validator.validateLeafType(elt, t, known, lead);
          } else if (t instanceof Array) {

            var subKnown;
            var subErrors;
            for (var i = 0; i < t.length; ++i) { // for(;;) for early return
              var disj = t[i];
              subKnown = known.slice();
              subErrors = this.validateLeafType(elt, disj, subKnown, lead);
              if (subErrors.length === 0) {
                return [];
              }
            }
            return [Error("validateType: no matching choice testing " + JSON.stringify(elt) + " against " + JSON.stringify(t))];
          } else if (t.type === "array") {
            return elt.reduce(function (ret, e) {
              return ret.concat(_validator.validateLeafType(e, t.of, known, lead+EXP));
            }, []);
          } else if (t.type === "map") {
            return Object.keys(elt).reduce(function (ret, from) {
              return ret.concat(_validator.validateLeafType(from, t.from, known, lead+EXP)).
                concat(_validator.validateLeafType(elt[from], t.to, known, lead+EXP));
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
          return this.validateLeafType(elt, nob.id, known, lead);
        },
        validatePropertyList: function (elt, list, known, lead) {
          var _validator = this;
          var errors = [];
          list.forEach(function (li) {
            errors = errors.concat(_validator.validateExpr(elt, li, known, lead+EXP));
            // console.log(lead, "T      choice testing ", elt, " for ", li);
            // var t = _validator.validateExpr(elt, li, known, lead+EXP);
            // var disposition = t.length === 0 ? "PASSED" : "FAILED";
            // console.log(lead, disposition, " choice testing ", elt, " for ", li, " yielded ", t);
            // errors = errors.concat(t);
          });
          return errors;
        },
        validateEpsilon: function (ep) {
          return "<span class=\"comment\"># empty</span>";
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
            return [Error("No matching disjunction testing " + JSON.stringify(elt) + " against " + JSON.stringify(expr) + "\n" + subErrors.map(function (errors) { return errors.map(function (e) { return e.message.split(/\n/).map(function (s) { return "│ " + s; }).join("\n"); }).join(",\n"); }).join("\n├──────\n") + "\n└──────")];

          case "epsilon":
            known.push(expr.id)
            return [];

          default:
            throwUnexpected("type", expr);
          }
        },
        validateObject: function (elt, as, leadp) {
          var _validator = this;
          var lead = leadp + as+OBJ;
          Assert(elt instanceof Object);
          Assert(as !== undefined);
          var defn = schema.map[as];
          Assert(defn.type === "object");
          Assert(defn !== undefined);
          Assert("type" in elt); if (elt.type === "valueClass") { debugger; }
          if (elt.type !== as) { return [Expected("type", as, elt)]; }
          var known = ["type"];
          var errors = this.validateExpr(elt, defn.expr, known, lead);
          // console.log(lead, "known:", known);
          // console.log(lead, "shown:", Object.keys(elt));
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
        },
        validate: function (elt) {
          return this.validateObject(elt, schema.start, "");
        }
      };
    },
    htmlSerializer: function (options) {
      function extend (base) { // Ruben's util function
        if (!base) base = {};
        for (var i = 1, l = arguments.length, arg; i < l && (arg = arguments[i] || {}); i++)
          for (var name in arg)
            base[name] = arg[name];
        return base;
      }

      options = extend({wrap: 80, descriptions: false}, options);
      function aan (s) { // return: a str or an str
        return "aeiou".indexOf(s[0]) === -1 ? ("A " + s + " ") : ("An " + s + " ");
      }

      return {
        serializeLeafType: function (ft) {
          if (ft[0] === "\"") {
            return "<span class=\"literal\">"+ft+"</span>";
          }
          var dt = 
            schema.map[ft].type === "object" ? "objref" :
            schema.map[ft].type === "nonObject" ? "nobref" :
            schema.map[ft].type === "terminal" ? "trmref" :
            throwUnexpected("type", schema.map[ft]);
          var anchor = schema.map[ft].type === "nonObject" ? "#dfn-" + ft : "#dcl-" + ft;
          return "<a class=\"" + dt + "\" href=\"" + anchor + "\">" + ft + "</a>";
        },
        describeLeafType: function (ft) {
          if (ft[0] === "\"") {
            return "<span class=\"literal\">"+ft+"</span>";
          }
          var dt =
            schema.map[ft].type === "object" ? "objref" :
            schema.map[ft].type === "nonObject" ? "nobref" :
            schema.map[ft].type === "terminal" ? "trmref" :
            throwUnexpected("type", schema.map[ft]);
          var anchor = schema.map[ft].type === "nonObject" ? "#dfn-" + ft : "#dcl-" + ft;
          return "<a class=\"" + dt + "\" href=\"" + anchor + "\">" + ft + "</a>";
        },
        serializeType: function (t) {
          var _htmlSerializer = this;
          return (typeof t !== "object") ? _htmlSerializer.serializeLeafType(t) :
            t instanceof Array ? "(" + t.map(function (ti) {
              return _htmlSerializer.serializeLeafType(ti);
            }).join("|") + ")" :
          t.type === "array" ? "[" + _htmlSerializer.serializeLeafType(t.of) + "]" :
            t.type === "map" ? "[" + _htmlSerializer.serializeLeafType(t.from) + "-&gt;" + _htmlSerializer.serializeLeafType(t.to) + "]" :
            throwUnexpected("type", t);
        },
        describeType: function (t) {
          var _htmlSerializer = this;
          return (typeof t !== "object") ? _htmlSerializer.describeLeafType(t) :
            t instanceof Array ? "(" + t.map(function (ti) {
              return _htmlSerializer.describeLeafType(ti);
            }).join("|") + ")" :
          t.type === "array" ? "a list of " + _htmlSerializer.describeLeafType(t.of) + "s" :
            t.type === "map" ? "a map from " + _htmlSerializer.describeLeafType(t.from) + " to " + _htmlSerializer.describeLeafType(t.to) + "" :
            throwUnexpected("type", t);
        },
        serializeProperty: function (prop) {
          return "" + prop.id + ":" + this.serializeType(prop.propertyType) + prop.card;
        },
        cardWords: function (card) {
          return card === "?" ? "an optional " : card === "*" ? "any number of " : "";
        },
        describeProperty: function (prop) {
          return "<code>" + prop.id + "</code>: " + this.cardWords(prop.card) + this.describeType(prop.propertyType);
        },
        serializePropertyEnumeration: function (prop) {
          return "("+prop.ids.
            // map(function (s) { return "<span class=\"literal\">\""+s+"\"</span>"; }).
            join("|")+")" + ":" + this.serializeType(prop.propertyType) + prop.card;
        },
        describePropertyEnumeration: function (prop) {
          return this.cardWords(prop.card) + "one of ("+prop.ids.
            // map(function (s) { return "<span class=\"literal\">\""+s+"\"</span>"; }).
            join(", ")+")" + ":" + this.describeType(prop.propertyType);
        },
        serializeReference: function (nob) {
          return "<a class=\"nobref\" href=\"#dfn-" + nob.id + "\">" + nob.id + "</a>" + nob.card
        },
        describeReference: function (nob) {
          return "<a class=\"nobref\" href=\"#dfn-" + nob.id + "\">" + nob.id + "</a>" + nob.card
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
          }).join("|");
        },
        describeOr: function (expr) {
          var _htmlSerializer = this;
          return "either:" + expr.exprs.map(function (oi) { // @@@ add multi-line
            return "<br /> &nbsp; &nbsp; &nbsp;" + _htmlSerializer.describeExpr(oi);
          }).join("");
        },
        serializeEpsilon: function (ep) {
          return "<span class=\"comment\"># empty</span>";
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
            if (production.type === "object" || production.type === "nonObject") {
              var x = production.type === "object" ?
                { cls: "obj", punctuation: ":", ishas: "has: a <code>type</code>: <span class=\"literal\">\""+production.id+"\"</span>, " } :
              { cls: "nob", punctuation: "=", ishas: "is: " };
              var text = options.descriptions ? "<tr class=\"description\"><th></th><td class=\"text999\" colspan=\"2\">"+"<span class=\""+x.cls+"\">"+aan(production.id)+"</span>"+x.ishas+_htmlSerializer.describeExpr(production.expr, true)+".</td></tr>\n" : "";
              var t = "<tr class=\""+x.cls+"\"><th id=\"dfn-" + production.id + "\" class=\""+x.cls+"\">" + production.id + "</th><td>" + x.punctuation + "</td><td>" + _htmlSerializer.serializeExpr(production.expr, true) + " ;</td></tr>\n";
              if (production.expr.type !== "or" || t.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "").length < options.wrap) {
                return t + text;
              }
              var rows = production.expr.exprs;
              var rowspan = " rowspan=\"" + rows.length + "\"";
              return "<tr class=\""+x.cls+"\"><th id=\"dfn-" + production.id + "\" class=\""+x.cls+"\">" + production.id + "</th><td>" + x.punctuation + "</td><td>" + _htmlSerializer.serializeExpr(rows[0]) + "</td></tr>\n" +
                rows.slice(1).map(function (r, ord) {
                  var semi = ord === rows.length - 2 ? " ;" : "";
                  return "    <tr><th></th><td>|</td><td>" + _htmlSerializer.serializeExpr(r) + semi + "</td></tr>\n"
                }).join("") + text;
            } else if (production.type === "terminal") {
              var heading = "";
              if (needTerminalsHeading) {
                heading = "<tr><th></th><th colspan=\"2\" style=\"text-align: left;\">Terminals</th></tr>\n";
                needTerminalsHeading = false;
              }
              return heading + "<tr class=\"trm\"><th id=\"dcl-"+production.id+"\"class=\"trm\">" + production.id + "</th><td>=</td><td>" + production.regexp + "</td></tr>\n";
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

