var path = require('path');
var assert = require('assert');
var sasstree = require('../index');

function parse(file, handler) {
  sasstree.parse({
    dir: path.resolve(__dirname, 'lib'),
    file: file
  }, handler);
}

describe('@import statement', function() {
  it ('includes a peer file dependency.', function(done) {
    parse('paths/index', function(err, data) {
      // @import 'sibling-a';
      assert.contain(data, '.index');
      assert.contain(data, '.sibling-a');
      done();
    });
  });

});