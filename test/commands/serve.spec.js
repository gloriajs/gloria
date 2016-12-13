var should = require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;

var serve = require('../../lib/commands/serve');
var Project = require('../../lib/core/project');

describe('serve command is a valid module', function () {
    it('will always pass unless serve is undefined', () => null);
});

describe('Serve', function () {
    describe('serveAndBuildSite', function () {
            it('exists', function () {
                    assert.isFunction(serve.serveAndBuildSite);
                }
            );
        }
    );
    describe('initializeSite', function () {
            it('exists', function () {
                    assert.isFunction(serve.initializeSite);
                }
            );
            it('returns a function', function () {
                    let dest = '';
                    assert.isFunction(serve.initializeSite(dest));
                }
            );
        }
    );
    describe('serveStaticAssets', function () {
            it('exists', function () {
                    assert.isFunction(serve.serveStaticAssets);
                }
            );
        }
    );
    describe('setRoutes', function () {
            it('exists', function () {
                    assert.isFunction(serve.setRoutes);
                }
            );
        }
    );
    describe('watchSourceFiles', function () {
            it('exists', function () {
                    assert.isFunction(serve.watchSourceFiles);
                }
            );
        }
    );
    describe('launchSite', function () {
            it('exists', function () {
                    assert.isFunction(serve.launchSite);
                }
            );
        }
    );
});
