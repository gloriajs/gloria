const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _collect = require('../../commands/collect');
const _extract = require('../../commands/extract');
const _prebuild = require('../../commands/prebuild');
const _build = require('../../commands/build');
const fs = require('fs');
const upath = require('upath');

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

      if (argv.folder) {
        if (!fs.existsSync(argv.folder)) {
          fs.mkdirSync(argv.folder, { recursive: true });
        }

        html.map((file) => {
          const destination = upath.normalize(
            `${argv.folder}/${file.destination}`,
          );

          const parsed = upath.parse(destination);

          if (!fs.existsSync(parsed.dir)) {
            fs.mkdirSync(parsed.dir, { recursive: true });
          }

          fs.writeFileSync(destination, file.content);
        });
      }

      logger.log({ ...prochecto });
      return prochecto;
    })
    .catch((e) => {
      logger.error({ e });
    });
};

const options = {
  folder: {
    default: 'build',
    description: `Destination folder to output temporary HTML files.`,
  },
  dest: {
    default: null,
    description: `Destination folder to output JSON report.`,
  },
};

/**
 * Command to compile html files
 */
module.exports = {
  command: `build [folder] [dest] [write]`,
  aliases: ['html'],
  describe: `Builds the site into the desired destination.
    By default it will use a folder name 'build' in the root directory of the project.
    It won't build to a parent folder.
    The command will fail if _config.yml is invalid or not present.`,
  builder: options,
  handler: build,
};
