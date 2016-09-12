# uses tests in SPARQL.js and shexTest/shexTest.

test: test.js
	mocha test.js
	(cd ../../SPARQL.js/test/parsedQueries/ && \
	 (ls *.json | grep -v in.json | xargs \
	  ../../../jsg/lib/cli.js -l ../../../jsg/test/SPARQL.jsg))
	(cd ../../shexSpec/shexTest && \
	 (ls schemas/*.json | grep -v coverage.json | xargs \
	  ../../jsg/lib/cli.js doc/ShExJ.jsg) && \
         ../../jsg/lib/cli.js doc/ShExR.jsg validation/*.val)
