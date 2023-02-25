const logger = require('../utils/logger');
const upath = require('upath');
const fs = require('fs');

/**
 * Writes the HTHL property from the project to disk
 *
 * @param {*} project
 * @returns project
 */
const run = (project) => {
  const promise = new Promise((resolve, reject) => {
    const { html, config } = project;

    if (!html) {
      logger.error('Missing html data at css step');
      return reject();
    }


    html.map((file) => {
      if (!fs.existsSync(config.dest)) {
        fs.mkdirSync(config.dest, { recursive: true });
      }

      const destination = upath.normalize(`${config.dest}/${file.destination}`);

      const parsed = upath.parse(destination);

      if (!fs.existsSync(parsed.dir)) {
        fs.mkdirSync(parsed.dir, { recursive: true });
      }

      fs.writeFileSync(destination, file.content);
    });

    return resolve(project);
  });

  return promise;
};

module.exports = {
  run,
};
