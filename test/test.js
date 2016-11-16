var should = require('chai').should(),
    gloria = require('../bin/gloria');

describe('gloria is not undefined', function () {
  it('will always pass unless gloria is undefined', function() {});
});

require('./commands/index');
require('./commands/init');
require('./commands/build');
require('./commands/serve');


