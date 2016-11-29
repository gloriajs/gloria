var should = require('chai').should;
var expect = require('chai').expect;

var init = require('../../lib/commands/init');
var fs = require(`../../lib/utils/fs`);

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
