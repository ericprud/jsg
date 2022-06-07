# uses tests in ../../../RubenVerborgh/SPARQL.js and ../../../shexSpec/shexTest.

JISON?=../node_modules/jison/lib/cli.js

../lib/jsg.js: ../lib/jsg.jison
	(cd ../lib/ && make jsg.js)

test: mochaTests SPARQLTests ShExTests

mochaTests: test.js ../lib/jsg.js
	../node_modules/.bin/mocha -R dot test.js

SPARQLTests: test.js ../lib/jsg.js
	(cd ../../../RubenVerborgh/SPARQL.js/test/parsedQueries/ && \
	 (ls *.json | grep -v in.json | xargs \
	  ../../../../ericprud/jsg/lib/cli.js -l ../../../../ericprud/jsg/test/SPARQL.jsg))

ShExTests: ShExJTests ShExVTests

ShExJTests: test.js ../lib/jsg.js
	(cd ../../../shexSpec/shexTest ; \
	 (ls schemas/*.json | egrep -v '(coverage|representationTests).json' | xargs \
	  ../../ericprud/jsg/lib/cli.js doc/ShExJ.jsg))

ShExVTests: test.js ../lib/jsg.js
	(cd ../../../shexSpec/shexTest ; \
         ../../ericprud/jsg/lib/cli.js doc/ShExV.jsg validation/*.val)
	(cd ../../../shexSpec/shexTest ; \
         ../../ericprud/jsg/lib/cli.js doc/ShExV.jsg validation/*.err)

