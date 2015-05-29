# file-importer

[pre-release]

An `@import` mapper for assembling Sass file trees and/or other text-based file formats into flat files. This is useful for assembling a raw Sass codebase into an aggregated source, or using the Sass `@import` workflow as an aggregator for other filetypes.

This is a small stand-alone library with zero dependence on an actual Sass engine. All files are read, parsed for imports, and assembled entirely using plain text. File access and compilation is performed directly via Node, and `@import` statements are parsed using regular expressions.

**So, it can assemble my Sass source tree into a flat file?**

Yes. However, be mindful that imports are resolved through plain text, therefore the assembler will not be aware of `@import` statements that have been commented out. For a more intelligent parsing of Sass, combine this with [gonzales-pe](link-here).


## Install

```
npm install file-importer --save-dev
```

## Usage

```
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