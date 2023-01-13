const should = require('chai').should;
const expect = require('chai').expect;
const path = require('path');

const command = require('../../lib/commands/new');
const fs = require(`../../lib/utils/fs`);

const options = {
  title: 'hello World',
  folder: 'sample',
  verbose: false,
  type: 'post',
  category: 'sample',
};

describe('New command is a valid module', function () {
  it('will always pass unless command `new` is undefined', function () {
    expect(command).to.be.ok;
  });
});

describe('will run gloria new with sample options to create sample files:', function () {
  const result = command.handler(options);
  it(`will ensure the destination folder exists`, function () {
    const dir = fs.statSync(result.path);
    expect(dir.isDirectory()).to.equal(true);
  });

  it(`will ensure the destination file exists`, function () {
    const file = fs.statSync(result.path);
    expect(file).to.be.ok;
  });
});
