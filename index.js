var fs = require('fs');
var path = require('path');
var dir = require('node-dir');

/**
 * A stub file object for representing a loaded file.
 * @param { string } filepath the file's system path.
 * @param { string } data the string data of the file.
 */
function File(opts) {
  this.dir = opts.dir || process.cwd();
  this.file = opts.file || './';
  this.data = opts.data || null;
  this.meta = path.parse(this.file);
  this._parsed = false;
  this.lookups = [];

  // Forcibly format includePaths as an array:
  if (!Array.isArray(opts.includePaths))
    opts.includePaths = [];

  // Map includePaths into absolute paths:
  this.includePaths = opts.includePaths.map(function(include) {
    return path.isAbsolute(include) ? include : path.join(process.cwd(), include);
  });

  // Assemble complete list of base lookup paths:
  // (this is the file's given cwd, and included search paths)
  var basePaths = [this.dir].concat(this.includePaths);

  // Build lookup paths upon all base paths:
  for (var i=0; i < basePaths.length; i++) {
    var basePath = basePaths[i];

    // Given filename:
    // ex: "lib/file" => "/base/lib/file"
    if (!path.isAbsolute(this.file))
      this.lookups.push(path.join(basePath, this.file));

    // Given filename + extension:
    // ex: "lib/file" => "/base/lib/file.scss"
    if (!this.meta.ext)
      this.lookups.push(path.join(basePath, this.meta.dir, this.meta.name + '.scss'));

    // Prefixed filename + extension:
    // ex: "lib/file" => "/base/lib/_file.scss"
    if (this.meta.name[0] !== '_')
      this.lookups.push(path.join(basePath, this.meta.dir, '_'+ this.meta.name + '.scss'));
  }
}

File.prototype = {
  // Specifies if the file had been read:
  // (fulfilled once the file has been given data)
  isLoaded: function() {
    return (typeof this.data === 'string');
  },

  // Specifies if the file has been parsed:
  // (fulfilled once the file has data and has completed parsing pass)
  isParsed: function() {
    return this.isLoaded() && this._parsed;
  },

  // Renders the file contents, and returns the result:
  render: function(done) {
    var self = this;

    // File needs data loaded:
    if (!this.isLoaded()) {
      resolveFile(self, function(err, files) {
        if (err) throw err;

        // Render all loaded files:
        for (var i=0; i < files.length; i++) {
          files[i].render(next);
        }

        function next(err, file) {
          if (err) throw err;

          var data = '';
          for (var i=0; i < files.length; i++) {
            if (!files[i].isParsed()) return;
            data += files[i].data + '\n';
          }

          self.data = data;
          parseFile(self, complete);
        }
      });
    }
    // File data needs to be parsed:
    else if (!this.isParsed()) {
      parseFile(self, complete);
    }
    // File is ready to go:
    else {
      complete();
    }

    function complete() {
      done(null, self);
    }

    return this;
  }
};

/**
 * Resolves file data based on its list of lookup paths.
 * Each lookup path is accessed until a file is found, or options are exhausted.
 * @param { File } file the File object to resolve lookup paths on.
 * @param { Function } done the fn to invoke upon completion. Invoked with (err, files).
 * @param { Number } index for internal use only. Advances recursive file access attempts.
 */
function resolveFile(file, done, index) {
  if (index === undefined) index = 0;

  var lookupFile = file.lookups[index];

  if (!lookupFile) {
    return done(new Error('Import "'+ file.file +'" could not be resolved.'));
  }

  fs.lstat(lookupFile, function(err, stats) {
    var files = [];

    function queue(filepath, data) {
      var meta = path.parse(filepath);
      files.push(new File({
        includePaths: file.includePaths,
        dir: meta.dir,
        file: meta.base,
        data: data
      }));
    }

    // Error:
    if (err) {
      if (err.code === 'ENOENT')
        return resolveFile(file, done, index+1);
    }

    // Directory:
    else if (stats.isDirectory()) {
      dir.readFiles(lookupFile, {
        recursive: false,
        match: /.scss$/,
        exclude: /^\./
      },
      function(err, data, filename, next) {
        if (err) throw err;
        queue(filename, data);
        next();
      },
      function(err, filenames) {
        if (err) throw err;
        done(null, files);
      });
    }

    // File:
    else if (stats.isFile()) {
      fs.readFile(lookupFile, function(err, data) {
        if (err) throw err;
        queue(lookupFile, data.toString('utf-8'));
        done(null, files);
      });
    }

  });
}

/**
 * Parses all @import statements within a file.
 * Each import creates a new file to load and render into the source.
 * @param { File } file the File object to parse data for.
 * @param { Function } done the fn to invoke upon completion. Invoked with (err, file).
 */
function parseFile(file, done) {
  var imports = {};

  // Parse out all `@import 'filename';` statements:
  // TODO: use AST to handle this work.
  file.data = file.data.replace(/@import\s+?['"]([^'"]+)['"];?/g, function(match, filepath) {
    if (!imports[filepath]) {
      imports[filepath] = new File({
        includePaths: file.includePaths,
        dir: file.dir,
        file: filepath
      }).render(next);
    }
    return '__'+ filepath +'__';
  });

  // Continuation handler, invoked upon every imported file render:
  function next(err, importFile) {
    if (err) throw err;

    if (importFile) {
      // Swap in imported file data for import tokens:
      file.data = file.data.replace(new RegExp('__'+ importFile.file +'__', 'g'), importFile.data);
    }

    for (var i in imports) {
      // Abort if there are any pending imports:
      if (imports.hasOwnProperty(i) && !imports[i].isParsed()) return;
    }

    // Mark file as parsed and roll on:
    file._parsed = true;
    done(null, file);
  }

  // Invoke continuation immedaitely:
  // This assumes we might not need to import anything,
  // in which case we're already set to continue.
  next();
}

module.exports.parse = function(opts, done) {
  new File(opts).render(function(err, file) {
    done(err, file.data);
  });
};


/*
go({
    file: 'test/lib/index',
    includePaths: ['./test/base/']
  },
  function(err, data) {
    if (err) throw err;
    console.log(data);
  });
  */