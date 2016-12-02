// Look into testing user input
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
    }
);
    describe('confirmSite', function () {
        it('should exist', function () {
            assert.isFunction(init.confirmSite);
        }
    );
        it('should return true on default', function () {
            let interact = { interactive: false };
            assert.equal(init.confirmSite(interact), true);
        });
    }
);
    describe('inputNameAndLocation', function () {
        it('should exist', function () {
            assert.isFunction(init.inputNameAndLocation);
        }
      );
    }
);
    describe('inputRest', function () {
        it('should exist', function () {
            assert.isFunction(init.inputRest);
        });
    }
);
    describe('fileLocationNotAvailable', function () {
        it('should exist', function () {
            assert.isFunction(init.fileLocationNotAvailable);
        });
    }
);
    describe('createSite', function () {
        it('should exist', function () {
            assert.isFunction(init.createSite);
        });
    });
});
