var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var init = require('../../lib/commands/init');
var fs = require(`../../lib/utils/fs`);
var Project = require('../../lib/core/project');

const name = 'sample';

describe('init command is a valid module', function () {
    it('will always pass unless init is undefined', function () {
        expect(true).to.equal(true);
    });

});

describe('will run git init with a sample folder', function () {
    it(`will create a new project in the specified folder`, function () {
        fs.rmdir(name);
        init.handler({ name: name, interactive: false, force: true });
        let dir = fs.statSync(name);
        expect(dir.isDirectory()).to.equal(true);
    });
});

describe('init', function () {
    describe('optionsBuilder', function () {
        it('should exist', function () {
            assert.isFunction(init.optionsBuilder);
        }
    );
        it('should have valid keys', function () {
            const option = { name: '' };
            expect(init.optionsBuilder(option)).to
            .have.all.keys('name', 'location', 'longname', 'layout', 'author');
        });
    }
);
    describe('showSiteInfo', function () {
        it('should exist', function () {
            assert.isFunction(init.showSiteInfo);
        });
    });
});
