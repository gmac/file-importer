# file-importer

An `@import` mapper for assembling Sass file trees and/or other text-based files into flat files. This is useful for assembling a raw Sass codebase into an aggregated source, or using the Sass `@import` workflow as an aggregator for other filetypes.

This is a small standalone library with no dependencies on an actual Sass engine. All files are read, parsed for imports, and assembled entirely as plain text. File access and compilation is performed directly via Node, and `@import` statements are parsed using regular expressions.

**So, I can assemble my Sass source tree into a flat file?**

Yes. However, be mindful that imports are resolved via plain text, therefore the assembler will still find `@import` statements within Sass comments. For intelligent parsing of Sass files, combine the importer with [gonzales-pe](link-here).


## Install

```
npm install file-importer --save-dev
```

## Usage

```javascript
var fileImporter = require('file-importer');

fileImporter.parse({
    file: 'lib/index',
    includePaths: ['./base/']
  },
  function(err, data) {
    if (err) throw err;
    console.log(data);
  });
```

### fileImporter.parse( options )

#### Requires at least ONE of the following options:

* **file**: String path to the file to load and parse. This may be an absolute path, or else a relative path from `process.cwd()` (or the provided `cwd` option). Uses `./` by default.

* **data**: String data to parse. When provided, file lookup is skipped and the string is parsed directly. You may still provide a `file` option for directory context while mapping imports.

#### Optional options:

* **extensions**: Array of file extensions to include while performing lookups. Configured as `['.scss']` by default for standard Sass import behavior. 

* **includePaths**: Array of base paths to search while perform file lookups. These should be absolute directory paths, or else relative to `process.cwd()` (or the provided `cwd` option).

* **cwd**: String path of the directory to resolve imports from. Uses `process.cwd()` by default.