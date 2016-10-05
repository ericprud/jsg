# jsg
json-grammar - a grammar-based validator for JSON structures

## Language

### Objects
Objects are represented by a production name followed by a "```{```", some name parameters or rule references, and "```}```".

| JSON Grammar |  | JSON | |
--- | --- | --- | ---
| ```doc { street:NAME no:NUM } ``` | would match | ```{ "street":"Elm", "no":123 }``` | if NAME and NUM were defined terminals. |

By convention, terminals labeled with ALL CAPS.

Object members and their types are expressed as ```memberName```:```type```.
A type can be a constant, terminal, rule name, or a list of types:

| JSON Grammar |  | JSON | |
--- | --- | --- | ---
| ```doc { status:"ready" } ``` | would match | ```{ "status":"ready" }``` |
| ```doc { street:NAME no:NUM } ``` | would match | ```{ "street":"Elm", "no":123 }``` |
| ```doc { street:nameOrTemplate } ``` | would match | ```{ "street":"{Elm}" }``` |
| ```doc { street:(name|template) } ``` | would match | ```{ "street":"{Elm}" }``` |

### Parameters

### Rules

Rules are represented by a terminal name followed by a "=", a list of choices, and a ";".

### Terminals
Terminals are represented by a terminal name followed by a ":" and a regular pattern (c.f. lex) nad a ";".

| JSON Grammar |  | JSON |
--- | --- | --- | ---
| ```LangRef : '@' [a-zA-Z0-9] MIDCHARS* ``` | would match | ```@ab-cd``` |

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
