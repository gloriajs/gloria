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
        }
      );
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
        let argv = { interactive: true };
        let project = new Project();
        let options = { name: 'test',
                        location: 'test', };
        it('should exist', function () {
            assert.isFunction(init.inputNameAndLocation);
        }
      );
        it('should return true if argv input', function () {
            assert.equal(init.inputNameAndLocation(argv, project, options), true);
        }
    );
        it('should return false if argv.interactive false', function () {
            argv = { interactive: false };
            options = { name: '', locations: '' };
            project = new Project(options);
            assert.equal(init.inputNameAndLocation(argv, project, options), false);
        });
    }
);
    describe('inputRest', function () {
        let argv = { interactive: true, name: 'test' };
        let project = new Project();
        let options = { author: 'test',
                        longname: 'test',
                        description: 'test',
                        layout: 'bootstrap', };
        it('should exist', function () {
            assert.isFunction(init.inputRest);
        }
    );
        it('should return true with all input', function () {
            assert.equal(init.inputRest(argv, project, options), true);
        }
    );
        it('project.config should have all keys', function () {
            Object.assign(options, init.optionsBuilder(argv), { author: 'test' });
            project = new Project(options);
            init.inputNameAndLocation(argv, project, options);
            init.inputRest(argv, project, options);
            expect(project.config).to
            .have.all.keys('name', 'location', 'longname',
                           'layout', 'author', 'description', 'version');
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
        }
    );
        it('should throw error with empty project', function () {
            let project = new Project();
            expect((() => init.createSite(project))).to.throw(/invalid location/);
        });
    });
});
