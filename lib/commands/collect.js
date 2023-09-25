const klaw = require('klaw');
const $q = require('q');
const logger = require('../utils/logger');
const root = process.cwd();
const S = require(`string`);
const path = require('path');

const _klaw = (folder, items, config) => {
  const promise = new Promise(function (resolve, reject) {
    klaw(folder)
      .on('data', (item) => {
        // @TODO: fix bug where is not ignoring excludes
        if (item.path.endsWith(config.exclude[0])) {
          return;
        } else {
          const shortPath = S(item.path).chompLeft(`${root}/`).s;
          /**  excludes the folder it was found in, for copying files as they are usually referenced this way */
          const relativePath = S(shortPath).chompLeft(folder).s;

          const details = {
            ...item,
            shortPath,
            relativePath,
          };

          items.push(details);
        }
      })
      .on('error', (e) => {
        logger.error(e);
        reject();
      })
      .on('end', () => {
        resolve();
      });
  });

  return promise;
};

// Actual collect file that the bin file calls after it processed the arguments or whatever
const run = (project) => {
  const promiseArray = [];

  const items = {
    include: [],
    copy: [],
    styles: [],
    theme: [],
  };

  project.config.include.map((path) => {
    promiseArray.push(_klaw(path, items.include, project.config));
  });

  // project.config.copy.map((path) => {
  //   promiseArray.push(_klaw(path, items.copy, project.config));
  // });

  project.config.theme.map((path) => {
    promiseArray.push(_klaw(path, items.theme, project.config));
  });

  return $q.all(promiseArray).then(() => {
    project.collected = items;
    return project;
  });
};

module.exports = {
  run,
};
