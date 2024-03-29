/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var jsg = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8,9,12],$V1=[1,9],$V2=[9,11],$V3=[1,19],$V4=[1,20],$V5=[1,30],$V6=[1,32],$V7=[1,33],$V8=[1,38],$V9=[1,39],$Va=[1,42],$Vb=[1,43],$Vc=[11,32],$Vd=[2,87],$Ve=[1,56],$Vf=[1,57],$Vg=[1,55],$Vh=[1,54],$Vi=[1,53],$Vj=[2,29],$Vk=[11,23,32],$Vl=[9,11,23,32,44,45],$Vm=[2,38],$Vn=[1,69],$Vo=[1,64],$Vp=[1,66],$Vq=[1,67],$Vr=[1,68],$Vs=[1,9,11,22,23,32,37,44,45,47,61,62,63],$Vt=[22,32,37,61,62,63],$Vu=[9,11,22,23,32,37,44,45,47,61,62,63],$Vv=[1,80],$Vw=[1,81],$Vx=[11,32,47],$Vy=[9,11,32,44,45,47,54,79],$Vz=[9,11,22,32,44,45,47,54,61,62,63,79],$VA=[32,47],$VB=[1,91],$VC=[9,11,23,32,37,44,45,47,54,79],$VD=[1,97],$VE=[1,100],$VF=[1,102],$VG=[9,32,44,45,47],$VH=[1,111],$VI=[9,11,23,32,44,45,47];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"doc":3,"Qdirective_E_Star":4,"QgrammarElt_E_Star":5,"directive":6,"grammarElt":7,"DOT_TYPE":8,"ID":9,"Q_O_QGT_MINUS_E_S_QID_E_Plus_C_E_Opt":10,"GT_SEMI":11,"DOT_IGNORE":12,"QID_E_Star":13,"QID_E_Plus":14,"O_QGT_MINUS_E_S_QID_E_Plus_C":15,"GT_MINUS":16,"objectDef":17,"arrayDef":18,"nonObject":19,"lexerRuleSpec":20,"objectExpr":21,"GT_LCURLEY":22,"GT_RCURLEY":23,"resolve_Qparticle_E_Plus":24,"Q_O_QGT_PIPE_E_S_Qparticle_E_Star_C_E_Star":25,"GT_MINUS_GT":26,"propertyType":27,"Qparticle_E_Plus":28,"particle":29,"Qparticle_E_Star":30,"O_QGT_PIPE_E_S_Qparticle_E_Star_C":31,"GT_PIPE":32,"arrayExpr":33,"GT_LBRACKET":34,"Q_O_QGT_PIPE_E_S_QpropertyType_E_C_E_Star":35,"QebnfSuffix_E_Opt":36,"GT_RBRACKET":37,"O_QGT_PIPE_E_S_QpropertyType_E_C":38,"QGT_COMMA_E_Opt":39,"GT_COMMA":40,"ebnfSuffix":41,"propertyOrGroup":42,"GT_COLON":43,"STRING":44,"GT_LPAREN":45,"Q_O_QGT_PIPE_E_S_QID_E_C_E_Plus":46,"GT_RPAREN":47,"resolve_QpropertyOrGroup_E_Plus":48,"Q_O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C_E_Plus":49,"O_QGT_PIPE_E_S_QID_E_C":50,"QpropertyOrGroup_E_Plus":51,"O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C":52,"typeAlternatives":53,"GT_DOT":54,"O_QID_E_Or_QSTRING_E_C":55,"Q_O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C_E_Plus":56,"O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C":57,"GT_EQUAL":58,"lexerStart":59,"lexerRuleBlock":60,"GT_OPT":61,"GT_TIMES":62,"GT_PLUS":63,"INT":64,"Q_O_QGT_COMMA_E_S_QINT_E_Or_QGT_TIMES_E_Opt_C_E_Opt":65,"O_QINT_E_Or_QGT_TIMES_E_C":66,"Q_O_QINT_E_Or_QGT_TIMES_E_C_E_Opt":67,"O_QGT_COMMA_E_S_QINT_E_Or_QGT_TIMES_E_Opt_C":68,"lexerAltList":69,"lexerAlt":70,"Q_O_QGT_PIPE_E_S_QlexerAlt_E_C_E_Star":71,"O_QGT_PIPE_E_S_QlexerAlt_E_C":72,"lexerElements":73,"QlexerElement_E_Plus":74,"lexerElement":75,"lexerAtom":76,"lexerBlock":77,"terminal":78,"LEXER_CHAR_SET":79,"$accept":0,"$end":1},
terminals_: {2:"error",8:"DOT_TYPE",9:"ID",11:"GT_SEMI",12:"DOT_IGNORE",16:"GT_MINUS",22:"GT_LCURLEY",23:"GT_RCURLEY",26:"GT_MINUS_GT",32:"GT_PIPE",34:"GT_LBRACKET",37:"GT_RBRACKET",40:"GT_COMMA",43:"GT_COLON",44:"STRING",45:"GT_LPAREN",47:"GT_RPAREN",54:"GT_DOT",58:"GT_EQUAL",61:"GT_OPT",62:"GT_TIMES",63:"GT_PLUS",64:"INT",79:"LEXER_CHAR_SET"},
productions_: [0,[3,2],[4,0],[4,2],[5,0],[5,2],[6,4],[6,3],[14,1],[14,2],[15,2],[10,0],[10,1],[13,0],[13,2],[7,1],[7,1],[7,1],[7,1],[17,2],[21,2],[21,4],[21,5],[24,1],[28,1],[28,2],[30,0],[30,2],[31,2],[25,0],[25,2],[18,2],[33,5],[38,2],[35,0],[35,2],[39,0],[39,1],[36,0],[36,1],[29,2],[29,1],[42,4],[42,4],[42,7],[42,4],[50,2],[46,1],[46,2],[48,1],[51,1],[51,2],[52,2],[49,1],[49,2],[27,1],[27,1],[27,1],[27,1],[27,3],[27,1],[53,2],[55,1],[55,1],[57,2],[56,1],[56,2],[19,5],[20,4],[59,1],[41,1],[41,1],[41,1],[41,4],[66,1],[66,1],[67,0],[67,1],[68,2],[65,0],[65,1],[60,1],[69,2],[72,2],[71,0],[71,2],[70,1],[70,0],[73,1],[74,1],[74,2],[75,2],[75,2],[77,3],[76,1],[76,1],[76,1],[78,1],[78,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

        return makeGrammar($$[$0-1], $$[$0]);
    
break;
case 2:
this.$ = { };
break;
case 3:
this.$ = extend($$[$0-1], $$[$0]);
break;
case 4: case 11: case 13:
this.$ = [ ];
break;
case 5: case 9: case 14: case 25: case 27: case 30: case 35: case 48: case 54: case 66: case 85: case 90:
this.$ = $$[$0-1].concat($$[$0]);
break;
case 6:
this.$ = { discriminator: { property: $$[$0-2], undiscriminated: $$[$0-1] } };
break;
case 7:
this.$ = { ignore: $$[$0-1] };
break;
case 8: case 24:
this.$ = [ $$[$0] ];
break;
case 10: case 33: case 46: case 52: case 64: case 78: case 83:
this.$ = $$[$0];
break;
case 19: case 31:
this.$ = extend({ id: $$[$0-1]}, $$[$0]);
break;
case 20:
this.$ = { type: "object", expr: { type: "epsilon" } };
break;
case 21:
this.$ = { type: "object", expr: $$[$0-1].length ? { type: "or", exprs: [$$[$0-2]].concat($$[$0-1]) } : $$[$0-2] };
break;
case 22:
this.$ = { type: "map", from: $$[$0-3], to: $$[$0-1] };
break;
case 23: case 49:
this.$ = $$[$0].length > 1 ? { type: "propertyList", exprs: $$[$0] } : $$[$0][0];
break;
case 26: case 29: case 34: case 84:
this.$ = [];
break;
case 28:
this.$ = $$[$0].length === 0 ? { type: "epsilon" } : $$[$0].length === 1 ? $$[$0] : { type: "propertyList", exprs: $$[$0] };
break;
case 32:

      this.$ = { type: "array", of: $$[$0-2].length ? { type: "or", exprs: [$$[$0-3]].concat($$[$0-2]) } : $$[$0-3] };
      if ($$[$0-1])
        this.$.card = $$[$0-1];
    
break;
case 38:
this.$ = "";
break;
case 40:
this.$ = { type: "reference", id: $$[$0-1], card: $$[$0] };
break;
case 42:
this.$ = { type: "property", id: $$[$0-3], propertyType: $$[$0-1], card: $$[$0] };
break;
case 43:
this.$ = { type: "property", id: $$[$0-3].substr(1, $$[$0-3].length-2), propertyType: $$[$0-1], card: $$[$0] };
break;
case 44:
this.$ = { type: "propertyEnumeration", ids: [$$[$0-5]].concat($$[$0-4]), propertyType: $$[$0-1], card: $$[$0] };
break;
case 45:
this.$ = { type: "or", exprs: [$$[$0-2]].concat($$[$0-1]) };
break;
case 47: case 50: case 65: case 89:
this.$ = [$$[$0]];
break;
case 51:
this.$ = $$[$0-1].concat($$[$0-1]);
break;
case 53:
this.$ = [$$[$0]];;
break;
case 55:
this.$ = { type: "reference", id: $$[$0], card: "" };
break;
case 59:
this.$ = { type: "typeChoices", choices: $$[$0-1] };
break;
case 61:
this.$ = [$$[$0-1]].concat($$[$0]);
break;
case 67:
this.$ = { type: "nonObject", id: $$[$0-4], expr: $$[$0-1].length ? { type: "or", exprs: [$$[$0-2]].concat($$[$0-1]) } : $$[$0-2] };
break;
case 68:

      yy.lexer.popState();
      this.$ = { type: "terminal", id: $$[$0-3], rule: $$[$0-1] };
    
break;
case 69:
 yy.lexer.begin('lexer'); 
break;
case 73:
this.$ = { min: $$[$0-2], max: $$[$0-1] };
break;
case 75: case 76: case 79:
this.$ = "*";
break;
case 82:
this.$ = $$[$0].length ? { type: "alt", elts: [$$[$0-1]].concat($$[$0]) } : $$[$0-1];
break;
case 87:
this.$ = null;
break;
case 88:
this.$ = $$[$0].length > 1 ? { type: "seq", elts: $$[$0] } : $$[$0][0];
break;
case 91: case 92:
this.$ = $$[$0] === "" ? $$[$0-1] : { type: "rept", term: $$[$0-1], count: $$[$0] };
break;
case 93:
this.$ = $$[$0-1];
break;
case 95:
this.$ = testCharSet($$[$0].substr(1, $$[$0].length - 2));
break;
case 96:
this.$ = { type: "wildcard" };
break;
case 97:
this.$ = { type: "reference", ref: $$[$0] };
break;
case 98:
this.$ = { type: "literal", val: $$[$0].substr(1, $$[$0].length - 2) };
break;
}
},
table: [o($V0,[2,2],{3:1,4:2}),{1:[3]},o($V1,[2,4],{5:3,6:4,8:[1,5],12:[1,6]}),{1:[2,1],7:7,9:[1,12],17:8,18:9,19:10,20:11,59:13},o($V0,[2,3]),{9:[1,14]},o($V2,[2,13],{13:15}),o($V1,[2,5]),o($V1,[2,15]),o($V1,[2,16]),o($V1,[2,17]),o($V1,[2,18]),{21:16,22:$V3,33:17,34:$V4,43:[2,69],58:[1,18]},{43:[1,21]},{10:22,11:[2,11],15:23,16:[1,24]},{9:[1,26],11:[1,25]},o($V1,[2,19]),o($V1,[2,31]),{9:$V5,24:27,28:28,29:29,42:31,44:$V6,45:$V7},{9:[1,36],23:[1,34],24:35,28:28,29:29,42:31,44:$V6,45:$V7},{9:$V8,21:40,22:$V3,27:37,33:41,34:$V4,44:$V9,45:$Va,54:$Vb},o($Vc,$Vd,{60:44,69:45,70:46,73:47,74:48,75:49,76:50,77:51,78:52,9:$Ve,44:$Vf,45:$Vg,54:$Vh,79:$Vi}),{11:[1,58]},{11:[2,12]},{9:[1,60],14:59},o($V0,[2,7]),o($V2,[2,14]),o($Vc,$Vj,{25:61}),o($Vk,[2,23],{42:31,29:62,9:$V5,44:$V6,45:$V7}),o($Vl,[2,24]),o($Vl,$Vm,{36:63,41:65,22:$Vn,43:$Vo,61:$Vp,62:$Vq,63:$Vr}),o($Vl,[2,41]),{43:[1,70]},{9:[1,71],42:74,44:$V6,45:$V7,48:72,51:73},o($Vs,[2,20]),o([23,32],$Vj,{25:75}),o([9,23,32,44,45],$Vm,{36:63,41:65,22:$Vn,26:[1,76],43:$Vo,61:$Vp,62:$Vq,63:$Vr}),o($Vt,[2,34],{35:77}),o($Vu,[2,55]),o($Vu,[2,56]),o($Vu,[2,57]),o($Vu,[2,58]),{9:$Vv,44:$Vw,53:78,55:79},o($Vu,[2,60]),{11:[1,82]},{11:[2,81]},o($Vx,[2,84],{71:83}),o($Vx,[2,86]),o($Vx,[2,88],{76:50,77:51,78:52,75:84,9:$Ve,44:$Vf,45:$Vg,54:$Vh,79:$Vi}),o($Vy,[2,89]),o($Vy,$Vm,{41:65,36:85,22:$Vn,61:$Vp,62:$Vq,63:$Vr}),o($Vy,$Vm,{41:65,36:86,22:$Vn,61:$Vp,62:$Vq,63:$Vr}),o($Vz,[2,94]),o($Vz,[2,95]),o($Vz,[2,96]),o($VA,$Vd,{70:46,73:47,74:48,75:49,76:50,77:51,78:52,69:87,9:$Ve,44:$Vf,45:$Vg,54:$Vh,79:$Vi}),o($Vz,[2,97]),o($Vz,[2,98]),o($V0,[2,6]),{9:[1,88],11:[2,10]},o($V2,[2,8]),{11:[1,89],31:90,32:$VB},o($Vl,[2,25]),o($Vl,[2,40]),{9:$V8,21:40,22:$V3,27:92,33:41,34:$V4,44:$V9,45:$Va,54:$Vb},o($VC,[2,39]),o($VC,[2,70]),o($VC,[2,71]),o($VC,[2,72]),{64:[1,93]},{9:$V8,21:40,22:$V3,27:94,33:41,34:$V4,44:$V9,45:$Va,54:$Vb},{32:$VD,43:$Vo,46:95,50:96},{32:$VE,49:98,52:99},o($VA,[2,49],{42:101,9:$VF,44:$V6,45:$V7}),o($VG,[2,50]),{23:[1,103],31:90,32:$VB},{9:$V8,21:40,22:$V3,27:104,33:41,34:$V4,44:$V9,45:$Va,54:$Vb},{22:$Vn,32:[1,107],36:105,37:$Vm,38:106,41:65,61:$Vp,62:$Vq,63:$Vr},{47:[1,108]},{32:$VH,56:109,57:110},o($VA,[2,62]),o($VA,[2,63]),o($V1,[2,68]),o([11,47],[2,82],{72:112,32:[1,113]}),o($Vy,[2,90]),o($Vy,[2,91]),o($Vy,[2,92]),{47:[1,114]},o($V2,[2,9]),o($V1,[2,67]),o($Vk,[2,30]),o($Vl,[2,26],{30:115}),o($VI,$Vm,{41:65,36:116,22:$Vn,61:$Vp,62:$Vq,63:$Vr}),{23:[2,79],40:[1,119],65:117,68:118},o($VI,$Vm,{41:65,36:120,22:$Vn,61:$Vp,62:$Vq,63:$Vr}),{32:$VD,47:[1,121],50:122},o($VA,[2,47]),{9:[1,123]},{32:$VE,47:[1,124],52:125},o($VA,[2,53]),{9:$VF,42:74,44:$V6,45:$V7,48:126,51:73},o($VG,[2,51]),{43:$Vo},o($Vs,[2,21]),{23:[1,127]},{37:[1,128]},o($Vt,[2,35]),{9:$V8,21:40,22:$V3,27:129,33:41,34:$V4,44:$V9,45:$Va,54:$Vb},o($Vu,[2,59]),{32:$VH,47:[2,61],57:130},o($VA,[2,65]),{9:$Vv,44:$Vw,55:131},o($Vx,[2,85]),o($Vx,$Vd,{73:47,74:48,75:49,76:50,77:51,78:52,70:132,9:$Ve,44:$Vf,45:$Vg,54:$Vh,79:$Vi}),o($Vz,[2,93]),o($Vk,[2,28],{42:31,29:133,9:$V5,44:$V6,45:$V7}),o($VI,[2,42]),{23:[1,134]},{23:[2,80]},{23:[2,76],62:[1,138],64:[1,137],66:136,67:135},o($VI,[2,43]),{43:[1,139]},o($VA,[2,48]),o($VA,[2,46]),o($VI,[2,45]),o($VA,[2,54]),o($VA,[2,52]),o($Vs,[2,22]),o($Vs,[2,32]),o($Vt,[2,33]),o($VA,[2,66]),o($VA,[2,64]),o($Vx,[2,83]),o($Vl,[2,27]),o($VC,[2,73]),{23:[2,78]},{23:[2,77]},{23:[2,74]},{23:[2,75]},{9:$V8,21:40,22:$V3,27:140,33:41,34:$V4,44:$V9,45:$Va,54:$Vb},o($VI,$Vm,{41:65,36:141,22:$Vn,61:$Vp,62:$Vq,63:$Vr}),o($VI,[2,44])],
defaultActions: {23:[2,12],45:[2,81],118:[2,80],135:[2,78],136:[2,77],137:[2,74],138:[2,75]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

  function makeGrammar (directives, decls) {
    var m = { };
    var o = [ ];
    var terminals = [];
    decls.forEach(function (elt) {
      m[elt.id] = elt;
      o.push(elt.id);
      if (elt.type === "terminal")
        terminals.push(elt);
    });
    terminals.forEach(terminal => { compileRegexp(terminal, m); });
    return extend(directives, { start: o[0], order: o, type: "schema", map: m });
  }

  function logret (x) {
    console.warn(x);
    return x;
  }

  // Extends a base object with properties of other objects
  function extend(base) {
    if (!base) base = {};
    for (var i = 1, l = arguments.length, arg; i < l && (arg = arguments[i] || {}); i++)
      for (var name in arg)
        base[name] = arg[name];
    return base;
  }

  function compileRegexp (terminal, m) {
    //console.warn(JSON.stringify(terminal));
    function dive (elt) {
      switch (elt.type) {
      case "rept":
        return "(" + dive(elt.term) + ")" + elt.count;
      case "wildcard":
        return ".";
      case "alt":
        return "(" + elt.elts.map(e => {
          return dive(e);
        }).join("|") + ")";
      case "seq":
        return "(" + elt.elts.map(e => {
          return dive(e);
        }).join("") + ")";
      case "CCseq":
        return elt.elts.map(e => {
          return dive(e);
        }).join("");
      case "CCrange":
        return dive(elt.from) + "-" + dive(elt.to);
      case "charset":
        // special handling for multi-char (surrogate) ranges
        if (elt.expr.type === "CCrange"
            && ("vals" in elt.expr.from || "vals" in elt.expr.to)) {
          if (!("vals" in elt.expr.from) || !("vals" in elt.expr.to))
            throw Error("Not programmed for multi-length character range "
                        + JSON.stringify(elt.expr.from) + "-" + JSON.stringify(elt.expr.to)
                        + "\n  rephrase as e.g. [\\uF000-\\uFFEF][\\u10000-\\uEFFFF]");
          return "[" + dive({type: "hex", val: elt.expr.from.vals[0]}) + "-" + dive({type: "hex", val: elt.expr.to.vals[0]}) + "]"
            + "[" + dive({type: "hex", val: elt.expr.from.vals[1]}) + "-" + dive({type: "hex", val: elt.expr.to.vals[1]}) + "]";
        }
        return "[" + dive(elt.expr) + "]";
      case "ch":
      case "literal":
        if (elt.val.length === 0)
          return '';
        return elt.val.match(/(?:\\(?:u[0-9a-fA-F]+|[\\bnrt])|[^\\])/g).map(s => {
          var r = s.match(/(?:\\(?:u([0-9a-fA-F]+)|([\\bnrt]))|([^\\]))/);
          var a = atom(r[1], r[2], r[3]);
          switch (a.type) {
          case 'ch': return a.val.replace(/([?+*\\\.^$])/g, "\\$1");
          case 'esc': return "\\" + a.val;
          case 'hex':
            if ("vals" in a)
              return a.vals.map(v => "\\u" + v).join('');
            else
              return "\\u" + a.val;
          default: throw Error("unknown atom type: " + a.type)
          }
        }).join('');
      case "CCnot":
        return "^" + dive(elt.expr);
      case "esc":
        return "\\" + elt.val;
      case "hex":
        return "\\u" + elt.val;
      case "reference":
        var lookFor = elt.ref; if (!lookFor) throw Error("no ref in " + JSON.stringify(elt));
        var refd = m[lookFor]; if (!refd) throw Error(lookFor + " not found");
        compileRegexp(refd, m);
        return refd.pattern;
      default:
        throw Error("unknown elt type: " + JSON.stringify(elt));
//        console.warn(elt);
      }
    }
    if (!("regexp" in terminal))
      terminal.pattern = dive(terminal.rule);
    terminal.regexp = new RegExp("^(" + dive(terminal.rule) + ")$", "m");
  }

  function atom (hex, esc, ch) {
    if (hex) {
      const cp = parseInt(hex, 16)
      if (cp > 0xffff) {
        const s = String.fromCodePoint(cp);
        const cpz = [0, 1].map(i => s.charCodeAt(i).toString(16));
        return { type: "hex", vals: cpz };
      }
    }
    return hex ? { type: "hex", val: hex } :
    esc ? { type: "esc", val: esc } :
    { type: "ch", val: ch };
  }

  function testCharSet (str) {
    var not = false;
    if (str[0] === "^") {
      not = true;
      str = str.substr(1);
    }
    var ranges = str.match(/(?:\\(?:u[0-9a-fA-F]+|[\\bnrt])|[^\\])(?:-(?:\\(?:u[0-9a-fA-F]+|[\\bnrt])|[^\\]))?/g).map(s => {
      var r = s.match(/(?:\\(?:u([0-9a-fA-F]+)|([\\bnrt]))|([^\\]))(?:(-)(?:\\(?:u([0-9a-fA-F]+)|([\\bnrt]))|([^\\])))?/);
      var from = atom(r[1], r[2], r[3]);
      var ret = r[4] ? { type: "CCrange", from: from, to: atom(r[5], r[6], r[7]) } : from;
      return ret;
    });
    var seq = ranges.length > 1 ? { type: "CCseq", elts: ranges } : ranges[0];
    var ret = not ? { type: "CCnot", expr: seq } : seq;
    return { type: "charset", expr: ret };
  }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/**/
break;
case 1:return 43;
break;
case 2:return 11;
break;
case 3:return 'GT_DOLLAR';
break;
case 4:return 58;
break;
case 5:return 79;
break;
case 6:return 34;
break;
case 7:return 37;
break;
case 8:return 22;
break;
case 9:return 23;
break;
case 10:return 45;
break;
case 11:return 47;
break;
case 12:return 26;
break;
case 13:return 16;
break;
case 14:return 61;
break;
case 15:return 32;
break;
case 16:return 63;
break;
case 17:return 11;
break;
case 18:return 62;
break;
case 19:return 8;
break;
case 20:return 12;
break;
case 21:return 54;
break;
case 22:return 40;
break;
case 23:return 9;
break;
case 24:return 44;
break;
case 25:return 64;
break;
case 26:return 'invalid character '+yy_.yytext;
break;
}
},
rules: [/^(?:\s+|((\/\/|#)[^\u000a\u000d]*))/,/^(?::)/,/^(?:;)/,/^(?:\$)/,/^(?:=)/,/^(?:(\[([^\u005c\u005d]|\\.)*\]))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:->)/,/^(?:-)/,/^(?:\?)/,/^(?:\|)/,/^(?:\+)/,/^(?:;)/,/^(?:\*)/,/^(?:(\.[Tt][Yy][Pp][Ee]))/,/^(?:(\.[Ii][Gg][Nn][Oo][Rr][Ee]))/,/^(?:\.)/,/^(?:,)/,/^(?:([a-zA-Z_][a-zA-Z_0-9]*))/,/^(?:("([^\"]|\\")*"|'([^\']|\\')*'))/,/^(?:([0-9]+))/,/^(?:.)/],
conditions: {"lexer":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = jsg;
exports.Parser = jsg.Parser;
exports.parse = function () { return jsg.parse.apply(jsg, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}