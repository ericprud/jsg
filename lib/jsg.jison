%{
  function makeGrammar (directives, decls) {
    var m = { };
    var o = [ ];
    decls.forEach(function (elt) {
      m[elt.id] = elt;
      o.push(elt.id)
    });
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
%}

%lex

COMMENT			('//'|'#') [^\u000a\u000d]*
ID                      [a-zA-Z_]+
STRING                  '"' ([^\"]|'\\"')* '"'
DOT_TYPE                '.' [Tt][Yy][Pp][Ee]
DOT_IGNORE              '.' [Ii][Gg][Nn][Oo][Rr][Ee]
%%
\s+|{COMMENT} /**/
":"          return 'GT_COLON';
"$"          return 'GT_DOLLAR';
"="          return 'GT_EQUAL';
"["          return 'GT_LBRACKET';
"]"          return 'GT_RBRACKET';
"{"          return 'GT_LCURLEY';
"}"          return 'GT_RCURLEY';
"("          return 'GT_LPAREN';
")"          return 'GT_RPAREN';
"->"         return 'GT_MINUS_GT';
"?"          return 'GT_OPT';
"|"          return 'GT_PIPE';
"+"          return 'GT_PLUS';
";"          return 'GT_SEMI';
"*"          return 'GT_TIMES';
{DOT_TYPE}   return 'DOT_TYPE';
{DOT_IGNORE} return 'DOT_IGNORE';
"."          return 'GT_DOT';
{ID}         return 'ID';
{STRING}     return 'STRING';
.            return 'invalid character '+yytext;

/lex

/* operator associations and precedence */

//%start grammarDef

%% /* language grammar */

doc:
    _Qdirective_E_Star grammarDef	{
        return makeGrammar($1, $2);
    }
  ;

_Qdirective_E_Star:
      -> { }
    | _Qdirective_E_Star directive	-> extend($1, $2)
  ;

directive:
    DOT_TYPE ID GT_SEMI	-> { discriminator: $2 }
    | DOT_IGNORE _QID_E_Star GT_SEMI	-> { ignore: $2 }
  ;

_QID_E_Star:
      -> [ ]
    | _QID_E_Star ID	-> $1.concat($2)
  ;

grammarDef:
    _Q_O_QobjectDef_E_Or_QarrayDef_E_Or_QnonObject_E_Or_Qterminal_E_C_E_Star	
  ;

_O_QobjectDef_E_Or_QarrayDef_E_Or_QnonObject_E_Or_Qterminal_E_C:
    objectDef	
    | arrayDef	
    | nonObject	
    | terminal	
  ;

_Q_O_QobjectDef_E_Or_QarrayDef_E_Or_QnonObject_E_Or_Qterminal_E_C_E_Star:
      -> []
    | _Q_O_QobjectDef_E_Or_QarrayDef_E_Or_QnonObject_E_Or_Qterminal_E_C_E_Star _O_QobjectDef_E_Or_QarrayDef_E_Or_QnonObject_E_Or_Qterminal_E_C	-> $1.concat($2)
  ;

objectDef:
    ID objectExpr	
    -> extend({ id: $1}, $2)
  ;

objectExpr:
    GT_LCURLEY GT_RCURLEY
    -> { type: "object", expr: { type: "epsilon" } }
    | GT_LCURLEY _resolve_Qparticle_E_Plus _Q_O_QGT_PIPE_E_S_Qparticle_E_Star_C_E_Star GT_RCURLEY
    -> { type: "object", expr: $3.length ? { type: "or", exprs: [$2].concat($3) } : $2 }
    | GT_LCURLEY ID GT_MINUS_GT propertyType GT_RCURLEY	
    -> { type: "map", from: $2, to: $4 }
  ;

_resolve_Qparticle_E_Plus:
    _Qparticle_E_Plus	-> $1.length > 1 ? { type: "propertyList", exprs: $1 } : $1[0]
  ;

_Qparticle_E_Plus:
    particle	-> [ $1 ]
    | _Qparticle_E_Plus particle	-> $1.concat($2)
  ;

_Qparticle_E_Star:
      -> []
    | _Qparticle_E_Star particle	-> $1.concat($2)
  ;

_O_QGT_PIPE_E_S_Qparticle_E_Star_C:
    GT_PIPE _Qparticle_E_Star	
    -> $2.length === 0 ? { type: "epsilon" } : $2.length === 1 ? $2 : { type: "propertyList", exprs: $2 }
  ;

_Q_O_QGT_PIPE_E_S_Qparticle_E_Star_C_E_Star:
      -> []
    | _Q_O_QGT_PIPE_E_S_Qparticle_E_Star_C_E_Star _O_QGT_PIPE_E_S_Qparticle_E_Star_C	-> $1.concat($2)
  ;

arrayDef:
    ID arrayExpr	;

arrayExpr:
    GT_LBRACKET propertyType _Q_O_QGT_PIPE_E_S_QpropertyType_E_C_E_Star GT_RBRACKET	
    -> { type: "array", of: $3.length ? { type: "or", exprs: [$2].concat($3) } : $2 }
  ;

_O_QGT_PIPE_E_S_QpropertyType_E_C:
    GT_PIPE propertyType	-> $2
  ;

_Q_O_QGT_PIPE_E_S_QpropertyType_E_C_E_Star:
      -> []
    | _Q_O_QGT_PIPE_E_S_QpropertyType_E_C_E_Star _O_QGT_PIPE_E_S_QpropertyType_E_C	-> $1.concat($2)
  ;

_QGT_COMMA_E_Opt:
    
    | GT_COMMA	;

particle:
      ID _Qcardinality_E_Opt	-> { type: "reference", id: $1, card: $2 }
    | propertyOrGroup
  ;

_Qcardinality_E_Opt:
      -> ""
    | cardinality	;

propertyOrGroup:
      ID GT_COLON propertyType _Qcardinality_E_Opt	// !!! GT_OPT_OPT 'cause single predicate
      -> { type: "property", id: $1, propertyType: $3, card: $4 }
    | GT_LPAREN ID _Q_O_QGT_PIPE_E_S_QID_E_C_E_Plus GT_RPAREN GT_COLON propertyType _Qcardinality_E_Opt	
      -> { type: "propertyEnumeration", ids: [$2].concat($3), propertyType: $6, card: $7 }
    | GT_LPAREN _resolve_QpropertyOrGroup_E_Plus _Q_O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C_E_Plus GT_RPAREN	
      -> { type: "or", exprs: [$2].concat($3) }
  ;

_O_QGT_PIPE_E_S_QID_E_C:
    GT_PIPE ID	-> $2
  ;

_Q_O_QGT_PIPE_E_S_QID_E_C_E_Plus:
      _O_QGT_PIPE_E_S_QID_E_C	-> [$1]
    | _Q_O_QGT_PIPE_E_S_QID_E_C_E_Plus _O_QGT_PIPE_E_S_QID_E_C	-> $1.concat($2)
  ;

_resolve_QpropertyOrGroup_E_Plus:
      _QpropertyOrGroup_E_Plus	-> $1.length > 1 ? { type: "propertyList", exprs: $1 } : $1[0]
  ;

_QpropertyOrGroup_E_Plus:
      propertyOrGroup	-> [$1]
    | _QpropertyOrGroup_E_Plus propertyOrGroup	-> $1.concat($1)
  ;

_O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C:
    GT_PIPE _resolve_QpropertyOrGroup_E_Plus	-> $2
  ;

_Q_O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C_E_Plus:
    _O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C	-> [$1];
    | _Q_O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C_E_Plus _O_QGT_PIPE_E_S_QpropertyOrGroup_E_Plus_C	-> $1.concat($2)
  ;

propertyType:
      ID	-> { type: "reference", id: $1, card: "" }
    | STRING	
    | objectExpr	
    | arrayExpr	
    | GT_LPAREN typeAlternatives GT_RPAREN	-> { type: "typeChoices", choices: $2 }
    | GT_DOT
  ;

typeAlternatives:
    _O_QID_E_Or_QSTRING_E_C _Q_O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C_E_Plus	-> [$1].concat($2)
  ;

_O_QID_E_Or_QSTRING_E_C:
    ID
    | STRING
  ;

_O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C:
    GT_PIPE _O_QID_E_Or_QSTRING_E_C	-> $2
  ;

_Q_O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C_E_Plus:
    _O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C	-> [$1]
    | _Q_O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C_E_Plus _O_QGT_PIPE_E_S_QID_E_Or_QSTRING_E_C	-> $1.concat($2)
  ;

nonObject:
    ID GT_EQUAL _resolve_Qparticle_E_Plus _Q_O_QGT_PIPE_E_S_Qparticle_E_Star_C_E_Star GT_SEMI	
    -> { type: "nonObject", id: $1, expr: $4.length ? { type: "or", exprs: [$3].concat($4) } : $3 }
    //-> { type: "nonObject", id: $1, vals: [$3].concat($4) }
  ;

terminal:
    ID GT_COLON STRING _Q_O_QGT_PLUS_E_S_QSTRING_E_C_E_Star	-> { type: "terminal", id: $1, regexp: $3.slice(1, -1).concat($4.map(function (s) { return s.slice(1, -1); }).join('')) }
  ;

_O_QGT_PLUS_E_S_QSTRING_E_C:
    GT_PLUS STRING	-> $2
  ;

_Q_O_QGT_PLUS_E_S_QSTRING_E_C_E_Star:
      -> []
    | _Q_O_QGT_PLUS_E_S_QSTRING_E_C_E_Star _O_QGT_PLUS_E_S_QSTRING_E_C	-> $1.concat($2)
  ;

cardinality:
    GT_OPT	
    | GT_TIMES	;
