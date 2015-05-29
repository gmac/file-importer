var assert = require('assert');
var Mocha = require('mocha');
var mocha = new Mocha();

// Add custom assertions:
assert.contains = function(a, b) {
  if (a.indexOf(b) == -1) {
    assert.fail(a, b, 'expected to contain');
  }
};

mocha.reporter('dot');
mocha.addFile('test/resolution');

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});