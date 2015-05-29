var assert = require('assert');
var Mocha = require('mocha');
var mocha = new Mocha();

// Add custom assertions:
assert.contain = function(a, b) {
  if (a.indexOf(b) == -1) {
    assert.fail(a, b, 'expected to contain');
  }
};

assert.doesNotContain = function(a, b) {
  if (a.indexOf(b) != -1) {
    assert.fail(a, b, 'expected not to contain');
  }
};

mocha.reporter('dot');
mocha.addFile('test/resolution');
mocha.addFile('test/imports');

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});