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
    const { dest } = config;

    if (!html) {
      logger.error('Missing html data at css step');
      return reject();
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    html.map((file) => {
      const destination = upath.normalize(`${dest}/${file.destination}`);

      const parsed = upath.parse(destination);

      if (!fs.existsSync(parsed.dir)) {
        fs.mkdirSync(parsed.dir, { recursive: true });
      }

      fs.writeFileSync(destination, file.content);
    });

    project.extracted.copy.map((file) => {
      const destination = upath.normalize(`${dest}/${file.relativePath}`);
      const parsed = upath.parse(destination);

      if (parsed.dir && !fs.existsSync(parsed.dir)) {
        fs.mkdirSync(parsed.dir, { recursive: true });
      }

      if (!file.isDir) {
        fs.writeFileSync(destination, file.content);
      }

    });

    return resolve(project);
  });

  return promise;
};

module.exports = {
  run,
};
