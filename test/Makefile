# uses tests in SPARQL.js and shexTest/shexTest.

JISON?=../node_modules/jison/lib/cli.js

../lib/jsg.js: ../lib/jsg.jison
	(cd ../lib/ && $(JISON) $^ -o $@ -p lalr)

test: test.js ../lib/jsg.js
	mocha test.js
	(cd ../../SPARQL.js/test/parsedQueries/ && \
	 (ls *.json | grep -v in.json | xargs \
	  ../../../jsg/lib/cli.js -l ../../../jsg/test/SPARQL.jsg))
	(cd ../../shexSpec/shexTest && \
	 (ls schemas/*.json | grep -v coverage.json | xargs \
	  ../../jsg/lib/cli.js doc/ShExJ.jsg) && \
         ../../jsg/lib/cli.js doc/ShExR.jsg validation/*.val)
