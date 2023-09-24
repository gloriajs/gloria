const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _setup = require('../../commands/setup');
const fs = require('fs');

/**
 * Normally called as part of another command, but it can be used
 * directly for debugging purposes.
 * When given an output argument it will write the results and
 * additional information to disk in a json file.
 *
 * Default include-paths are pages and posts.
 * @param {string} argv.dest If present, write result to destination file
 */
const setup = (argv) => {
  const { defaults } = config;

  _setup.run({ config: defaults }, argv.overwrite).then((project) => {
    // logger.log();

    return project;
  });
};

const options = {
  overwrite: {
    default: false,
    description: `Overwrite existing files: not yet supported.`,
  },
};

module.exports = {
  command: `setup`,
  aliases: [],
  describe: `Attemps to create a _config.yml file and the necesary folders.`,
  builder: options,
  handler: setup,
};
