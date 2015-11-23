JISON?=../node_modules/jison/lib/cli.js

jsg.js: jsg.jison
	$(JISON) $^ -o $@ -p lalr

ShExJ-validator.js: ../test/ShExJ.jsg ../test/ShExJ_all.json json-grammar.js jsg.js
	(cd ../test && mocha -R dot) # node json-grammar $< ShExJ_all.json

test: ShExJ-validator.js
