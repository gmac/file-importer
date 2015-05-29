var path = require('path');
var assert = require('assert');
var fileImporter = require('../index');

function parse(file, handler) {
  fileImporter.parse({
    includePaths: [path.resolve(__dirname, 'lib/base')],
    dir: path.resolve(__dirname, 'lib'),
    file: file
  }, handler);
}

describe('@import path', function() {
  it ('includes locally-pathed file dependencies.', function(done) {
    parse('paths/index', function(err, data) {
      // @import 'path/a'
      assert.contain(data, '.index');
      assert.contain(data, '.path_a');
      done();
    });
  });

  it ('resolves deep file dependencies, each import relative to the current file.', function(done) {
    parse('paths/index', function(err, data) {
      // @import 'path/a' => @import 'path/b'
      assert.contain(data, '.path_path_b');
      done();
    });
  });

  it ('resolves deep file dependencies with path backtraces.', function(done) {
    parse('paths/index', function(err, data) {
      // @import 'path/a' => @import 'path/b' => @import '../../c'
      assert.contain(data, '.c');
      done();
    });
  });

  it ('resolves files available via includePaths.', function(done) {
    parse('paths/index', function(err, data) {
      // @import 'common/d'
      assert.contain(data, '.common_d');
      done();
    });
  });
});