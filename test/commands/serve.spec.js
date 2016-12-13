var should = require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;

var serve = require('../../lib/commands/serve');
var Project = require('../../lib/core/project');

describe('serve command is a valid module', function () {
    it('will always pass unless serve is undefined', () => null);
});

describe('serve', function () {
    describe('serveAndBuildSite', function () {
            it('exists', function () {
                    assert.isFunction(serve.serveAndBuildSite);
                }
            );
            /*it('returns an Express object', function () {
                const project = new Project();
                const argv = {};
                const options = project.loadConfig('yaml');
                const dest = project.config.dest || argv.dest;
                assert.isObject(serve.serveAndBuildSite(argv, dest), 'returns express object');
            });*/
        });
});
