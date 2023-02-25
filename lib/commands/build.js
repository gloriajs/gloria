const logger = require('../utils/logger');

/**
 * Creates the resulting html by reading all the pages and parsing with the layouts
 *
 * @param {*} project
 * @returns project
 */
const run = (project) => {
  const promise = new Promise((resolve, reject) => {
    if (!project.collected || !project.extracted || !project.prebuilt) {
      logger.error('Missing prebuilt data at build step');
      return reject();
    }

    const result = [];

    const _files = project.prebuilt.files;
    const _data = project.prebuilt.data;

    _files.map((file, k) => {
      result[k] = file.compile_method(file.item, _files, {
        ..._data,
        page: {
          ...file.item.meta,
          ...file.item.attrs,
        },
      });
    });

    project.html = result;

    return resolve(project);
  });

  return promise;
};

module.exports = {
  run,
};
