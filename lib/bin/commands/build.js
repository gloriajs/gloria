const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _collect = require('../../commands/collect');
const _extract = require('../../commands/extract');
const _prebuild = require('../../commands/prebuild');
const _build = require('../../commands/build');
const _write_html = require('../../commands/write.html');
const fs = require('fs');

/**
 * work in progress, always add on top of existing ways and prevent
 * backwards compatibility issues
 *
 * Default include-paths are pages and posts.
 *
 * This method
 * @param {string} argv.dest If present, write result to destination file
 * @param {string} argv.folder If present writes files to folder
 * @param {string} argv.write If false, skips writing files to disk
 *
 * @return {object} information like content and medatata from every coollected path
 */
const build = (argv) => {
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
    html: [],
  };

  _collect
    .run(project)
    .then((project) => _extract.run(project))
    .then((project) => _prebuild.run(project))
    .then((project) => _build.run(project))
    .then((prochecto) => {
      const { config } = prochecto;

      if (argv.dest) {
        const dest = `./${argv.dest}/built.${config._hash}.json`;
        const ztring = JSON.stringify(prochecto);
        fs.writeFileSync(dest, ztring);
      }

      // logger.log({ ...prochecto });
      return _write_html.run(prochecto);
    })
    .catch((e) => {
      logger.error({ e });
    });
};

const options = {
  dest: {
    default: null,
    description: `Destination folder to output JSON report.`,
  },
};

/**
 * Command to compile html files
 */
module.exports = {
  command: `build [dest]`,
  aliases: ['html'],
  describe: `Compiles files, interpolates data and writes temp files to chosen destination.
    By default it will use a folder name 'build' in the root directory of the project,
    Check your _config.yml to change.
    It won't build to a parent folder.
    The command will fail if _config.yml is invalid or not present.`,
  builder: options,
  handler: build,
};
