const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _collect = require('../../commands/collect');
const _extract = require('../../commands/extract');
const _prebuild = require('../../commands/prebuild');
const _build = require('../../commands/build');
const _css_tailwind = require('../../commands/css.tailwind');
const fs = require('fs');
const upath = require('upath');
const _write_html = require('../../commands/write.html');

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
      const { config, html } = prochecto;

      if (argv.dest) {
        const dest = `./${argv.dest}/built.${config._hash}.json`;
        const ztring = JSON.stringify(prochecto);
        fs.writeFileSync(dest, ztring);
      }

      return _write_html.run(prochecto);
    })
    .then((project) => _css_tailwind.run(project))
    .then((project) => {
      // logger.log({ ...project });
    })
    .catch((e) => {
      logger.error({ e });
    });
};

const options = {
  dest: {
    default: null,
    description: `Destination for stylesheet.`,
  },
};

/**
 * Command to compile html files
 */
module.exports = {
  command: `css:tailwind [dest]`,
  aliases: ['tailwind'],
  describe: `Reads the html output and creates a tailwind stylesheet.
    The command will fail if _config.yml is invalid or not present.`,
  builder: options,
  handler: build,
};
