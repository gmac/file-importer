var path = require('path');
var assert = require('assert');
var sasstree = require('../index');

function parse(file, handler) {
  sasstree.parse({
    dir: path.resolve(__dirname, 'lib'),
    file: file
  }, handler);
}

describe('file resolution', function() {
  it ('resolves a requested file using file base name.', function(done) {
    parse('resolution/index', function(err, data) {
      assert.contains(data, '.index');
      done();
    });
  });

  it ('resolves a requested file with a full filename.', function(done) {
    parse('resolution/index.scss', function(err, data) {
      assert.contains(data, '.index');
      done();
    });
  });

  it ('resolves a requested file partial without underscore prefix.', function(done) {
    parse('resolution/prefix', function(err, data) {
      assert.contains(data, '.prefix');
      done();
    });
  });

  it ('resolves a requested file partial with underscore prefix.', function(done) {
    parse('resolution/_prefix', function(err, data) {
      assert.contains(data, '.prefix');
      done();
    });
  });

  it ('resolves a requested file partial without underscore prefix, but with file extension.', function(done) {
    parse('resolution/prefix.scss', function(err, data) {
      assert.contains(data, '.prefix');
      done();
    });
  });

  it ('resolves a requested file partial with underscore prefix and file extension.', function(done) {
    parse('resolution/_prefix.scss', function(err, data) {
      assert.contains(data, '.prefix');
      done();
    });
  });

  it ('resolves a requested directory into its complete ".scss" file contents.', function(done) {
    parse('resolution/group', function(err, data) {
      assert.contains(data, '.group_a');
      assert.contains(data, '.group_b');
      done();
    });
  });
});