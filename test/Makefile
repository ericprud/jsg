# uses tests in SPARQL.js and shexTest/shexTest.

JISON?=../node_modules/jison/lib/cli.js

../lib/jsg.js: ../lib/jsg.jison
	(cd ../lib/ && $(JISON) $^ -o $@ -p lalr)

test: mochaTests SPARQLTests ShExTests

mochaTests: test.js ../lib/jsg.js
	../node_modules/.bin/mocha -R dot test.js

SPARQLTests: test.js ../lib/jsg.js
	(cd ../../SPARQL.js/test/parsedQueries/ && \
	 (ls *.json | grep -v in.json | xargs \
	  ../../../jsg/lib/cli.js -l ../../../jsg/test/SPARQL.jsg))

ShExTests: ShExJTests ShExVTests

ShExJTests: test.js ../lib/jsg.js
	(cd ../../shexSpec/shexTest ; \
	 (ls schemas/*.json | grep -v coverage.json | xargs \
	  ../../jsg/lib/cli.js doc/ShExJ.jsg))

ShExVTests: test.js ../lib/jsg.js
	(cd ../../shexSpec/shexTest ; \
         ../../jsg/lib/cli.js doc/ShExV.jsg validation/*.val)
	(cd ../../shexSpec/shexTest ; \
         ../../jsg/lib/cli.js doc/ShExV.jsg validation/*.err)

