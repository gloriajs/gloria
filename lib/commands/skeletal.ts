const $log = require('winston');

function thank() {
    $log.log(`doot doot`);
}

const builder = {};

module.exports = {
    command: `thank mr skeltal`,
    aliases: [],
    describe: `doot doots.`,
    builder: builder,
    handler: thank,
};
