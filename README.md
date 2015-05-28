# node-sass-ast

[pre-release]

An assembler for deeply-nested Sass abstract syntax trees (ASTs). This tool is a wrapper around the fabulous [gonzales-pe](https://github.com/tonyganch/gonzales-pe) lexical analysis library, with extended support for resolving deeply-nested `@import` statements.

## What it Does

You want to study and/or intelligently modify your raw Sass files? Sure, [gonzales-pe](https://github.com/tonyganch/gonzales-pe) alone is excellent at this: Gonzales will parse your Sass files into an AST with the raw Sass broken down into primitive parts of speech. However, you can only see the contents of one file at a time: `@import` statements are simply grammatical nodes within a file's AST.

To study a full tree, deeply-nested `@import` statements must be resolved. `node-sass-ast` attempts to reconstitute a Sass file's source tree into a single file with the complete 



