const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _collect = require('../../commands/collect');
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
const collect = (argv) => {
  const project = {
    config: config.get(),
  };

  _collect.run(project).then((project) => {
    const { config } = project;

    if (argv.dest) {
      const dest = `./${argv.dest}/collected.${config._hash}.json`;
      const ztring = JSON.stringify(project.collected);
      fs.writeFileSync(dest, ztring);
    }

    logger.log(project.collected);

    return project;
  });
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
