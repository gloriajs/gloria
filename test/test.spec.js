const should = require('chai').should();
const gloria = require('../bin/gloria');
var expect = require('chai').expect;

require('mocha-jscs')();

describe('gloria is not undefined', function () {
    it('will always pass unless gloria is undefined', function () {
        expect(gloria).to.not.equal(undefined);
    });

});

require('./commands/index.spec');
require('./commands/init.spec');
require('./commands/build.spec');
require('./commands/serve.spec');
require('./utils/logger.spec');
