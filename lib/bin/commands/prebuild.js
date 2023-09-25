const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _collect = require('../../commands/collect');
const _extract = require('../../commands/extract');
const _prebuild = require('../../commands/prebuild');
const fs = require('fs');

/**
 * work in progress, always add on top of existing ways and prevent
 * backwards compatibility issues
 *
 * Default include-paths are pages and posts.
 *
 * This method
 * @param {string} argv.dest If present, write result to destination file
 * @param {string} argv.path If present overrides configuration file
 *
 * @return {object} information like content and medatata from every coollected path
 */
const prebuild = (argv) => {
  const project = {
    config: config.get(),
    collected: {},
    content: {},
    extracted: {},
    prebuilt: {
      files: {},
      styles: {},
      scripts: {},
    },
  };

  _collect
    .run(project)
    .then(_extract.run)
    .then(_prebuild.run)
    .then((prochecto) => {
      const { config } = prochecto;

      if (argv.dest) {
        const dest = `./${argv.dest}/extracted.${config._hash}.json`;
        const ztring = JSON.stringify(prochecto.extracted);
        fs.writeFileSync(dest, ztring);
      }

      return prochecto;
    })
    .catch((e) => {
      logger.error({ e });
    });
};

const options = {
  dest: {
    default: null,
    description: `Destination folder to output a json file with results.`,
  },
};

/**
 * Command to prepare everything for compilation
 */
module.exports = {
  command: `prebuild [dest] [path]`,
  aliases: [],
  describe: `Gets all files ready for compilation, applying the metadata extracted.`,
  builder: options,
  handler: prebuild,
};
