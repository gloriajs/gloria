const gloria = require(`../bin/gloria`);
const expect = require(`chai`).expect;
const lint = require(`mocha-eslint`);

lint([`lib/`, 'test/'], {});

describe('gloria is not undefined', function () {
    it('will always pass unless gloria is undefined', function () {
        expect(gloria).to.not.equal(undefined);
    });
});

require('./commands/index.spec');
require('./commands/init.spec');
require('./commands/new.spec');
require('./commands/build.spec');
require('./commands/serve.spec');
require('./utils/logger.spec');
