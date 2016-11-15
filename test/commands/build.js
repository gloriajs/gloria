var should = require('chai').should();
var expect = require('chai').expect;

var build = require('../../lib/commands/build');

describe('build command is a valid module', function () {
  it('will always pass unless build is undefined', function() {});
});


describe('build will refuse certain arguments', function () {
  it('will refuse to build if a parent directory is used as destination', function() {
      var attempt = build.handler({dest: '../'});
      expect(attempt).to.equal(null);
  });
});
