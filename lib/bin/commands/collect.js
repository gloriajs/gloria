const logger = require('../../utils/logger');

/**
 * Normally called as part of another command, but it can be used
 * directly for debugging purposes.
 * When given an output argument it will write the results and
 * additional information to disk in a json file.
 *
 * Default include-paths are pages and posts.
 * @param {*} argv
 */
const collect = (argv) => {
    logger.log('quack');
};

const options = {
    dest: {
        default: null,
        description: `Destination path or folder to output a json file with results.`,
    },
};

module.exports = {
    command: `collect [output]`,
    aliases: [],
    describe: `Collects the files and data that will be processed.`,
    builder: options,
    handler: collect,
};
