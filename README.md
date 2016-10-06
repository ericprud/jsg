# json-grammar - a grammar-based validator for JSON structures

JSON Grammar, or **JSG**, is a language for describing the structure of JSON documents.
It can be used for documentation, describing what a service or tool consumes or emits, and validation, testing conformance of some data to that description.

## Language

A *JSG* schema is composed of objects, rules and values.
Objects are represented by a production name followed by a "```{```", some named members or rule references, and "```}```".
These describe JSON objects like ```{ "street":"Elm", "number":"123b" }```.
A member is composed of an attribute name, a ":", and a type: ```{ "street":NAME, "number":NUMBER }```.
A type can be a constant, value pattern, rule name, or a list of types:

By convention, value patterns labeled with ALL CAPS.

<table><thead>
<tr><th>JSON Grammar</th><th>matching JSON</th><th></th></tr>
</thead><tbody>
<tr><td><pre>doc { status:"ready" }</pre></td><td><ul>
<li><code>{ "status":"ready" }</code></li>
</ul></td><td></td></tr>
<tr><td><pre>doc { street:NAME no:NUM }
NAME : .*;
NUM : [0-9]+[a-e]?;</pre></td><td><ul>
<li><code>{ "street":"Elm", "no":1 }</code></li>
<li><code>{ "street":"Elm", "no":123 }</code></li>
<li><code>{ "street":"Elm", "no":123b }</code></li>
</ul></td><td></td></tr>
<tr><td><pre>doc { street:(NAME|"*"|TEMPLATE) }
NAME : .*;
TEMPLATE : '{' .* '}';</pre></td><td><ul>
<li><code>{ "street":"Elm" }</code></li>
<li><code>{ "street":"*" }</code></li>
<li><code>{ "street":"{mumble}" }</code></li>
</ul></td><td></td></tr>
<tr><td><pre>doc { street:nameOrTemplate }
nameOrTemplate = NAME | "*" | TEMPLATE
NAME : .*;
TEMPLATE : '{' .* '}';</pre></td><td><ul>
<li><code>{ "street":"Elm" }</code></li>
<li><code>{ "street":"*" }</code></li>
<li><code>{ "street":"{mumble}" }</code></li>
</ul></td><td></td></tr>
</tbody></table>

A schema can be composed with no rules but rule names can help with:
* factoring common patterns
* shortening member types
* applying semantic names to patterns.

### Values
Values are represented by a terminal name followed by a ":" and a regular pattern (c.f. lex) nad a ";".
They can reference each other (but not circularly) allowing a value to be composed of other values.
The syntax is reminiscent of EBNF or W3C language specifications, e.g.:

<table><thead>
<tr><th>Value pattern</th><th>matching JSON</th><th></th></tr>
</thead><tbody>
<tr><td><pre>'@' START+ ('-' MIDCHAR+)*
START : [a-zA-Z];
MIDCHAR : START | [0-9];
NUM : [0-9]+[a-e]?;</pre></td><td><ul>
<li><code>@en</code></li>
<li><code>@en-US</code></li>
<li><code>@de-CH-1901</code></li>
</ul></td><td></td></tr>
</tbody></table>

Code points in values can be specified by:
* a symbol in a quoted string (```'-'```, ```"x-"```, ```'"'```),
* a symbol in a character range (```[a-z]```)
* a hexidecimal numeric unicode code point.

If we had a disdain for writing the letter '`a`' and the symbol '`@`', we could write the above value pattern as:

<pre>\u0040 START+ ('-' MIDCHAR+)*
START : [\u0061-z\u0041-Z];
MIDCHAR : START | [0-9];
NUM : [0-9]+[\u0061-e]?;</pre>

### .Directives

* .IGNORE takes a list of properties to globally ignore.
* .TYPE takes a single property to act as a type discriminator which must match the production name.

| JSON Grammar |  | JSON |
--- | --- | --- |
| ```doc { a:STRING } STRING=".*"```                |passes| ```{ "a":"hi" }```                 |
| ```doc { a:STRING } STRING=".*"```                |fails | ```{ "type":"doc", "a":"hi" }```    |
| ```.IGNORE type; doc { a:STRING } STRING=".*"```  |passes| ```{ "type":"doc", "a":"hi" }```    |
| ```doc { a:STRING, type:STRING } STRING=".*"```   |passes| ```{ "type":"doc", "a":"hi" }```    |
| ```.TYPE type; doc { a:STRING } STRING=".*"```    |passes| ```{ "type":"doc", "a":"hi" }```    |
| ```.TYPE type; doc { a:STRING } STRING=".*"```    |fails | ```{ "type":"docXXX", "a":"hi" }``` |
You can push the .TYPE property into each object if you want (and have to if it's not universal).
Error reports on schemas with a .TYPE directive tend to be terser as failing a discriminator check shortcuts the tests of all the other object properties.
