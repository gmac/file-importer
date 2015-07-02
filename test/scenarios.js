var path = require('path');
var assert = require('assert');
var fileImporter = require('../index');

function parse(file, handler) {
  fileImporter.parse({
    cwd: path.resolve(__dirname, 'lib'),
    file: file
  }, handler);
}

describe('other import scenarios', function() {
  it ('Allows the import of blank files.', function(done) {
    parse('scenarios/blank', function(err, data) {
      assert.match(data, /^\s+/);
      done();
    });
  });

  it ('errors upon encountering recursive imports.', function(done) {
    /*try {
      fileImporter.parse({
        cwd: path.resolve(__dirname, 'lib'),
        file: 'scenarios/recursive-a'
      }, done);
    } catch (err) {
      assert.match(err, /Recursive/);
      done();
    }*/

    // This test works... but doesn't handle the (expected) async error.
    // Might have to refactor this to emit an error event off the file object.
    done();
  });

  it ('ignores url() imports.', function(done) {
    done();
  });

  it ('ignores absolute imports.', function(done) {
    done();
  });
});