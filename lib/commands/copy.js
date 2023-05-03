const klaw = require('klaw');
const $q = require('q');
const logger = require('../utils/logger');

/**
 *
 * Didn't abstract this yet coz is slightly different than collect
 * and will hopefully change differently
 * */
const _klaw = (path, items, config) => {
  const promise = new Promise(function (resolve, reject) {
    klaw(path)
      .on('data', (item) => {
        // @TODO: fix bug where is not ignoring excludes
        if (item.path.endsWith(config.exclude[0])) {
          return;
        } else {
          items.push(item);
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

// Actual copy method that collects the files
const run = (project) => {
  const promiseArray = [];

  const items = {
    copy: [],
  };

  project.config.copy.map((path) => {
    promiseArray.push(_klaw(path, items.copy, project.config));
  });

  return $q.all(promiseArray).then(() => {
    project.collected = items;
    return project;
  });
};

module.exports = {
  run,
};
