# jsg
json-grammar - a grammar-based validator for JSON structures

## Language

### Objects
Objects are represented by a production name followed by a "```{```", some name parameters or rule references, and "```}```".

| JSON Grammar |  | JSON | |
--- | --- | --- | ---
| ```doc { street:NAME no:NUM } ``` | would match | ```{ "street":"Elm",<br/> "no":123 }``` | if NAME and NUM were defined terminals. |

### Parameters

### Rules

### Terminals
Terminals are represented by a terminal name followed by a "```:```" and a PCRE in quotes (this would be nicer with "```//```"s).

| JSON Grammar |  | JSON |
--- | --- | --- | ---
| ```URL : "^[a-z]+://" ``` | would match | ```http://a.example/``` |

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
