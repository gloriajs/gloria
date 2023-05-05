const klaw = require('klaw');
const $q = require('q');
const logger = require('../utils/logger');
const fm = require('front-matter');
const path = require('path');
const fse = require('fs-extra');
const moment = require('moment');
const S = require(`string`);
const root = process.cwd();
const meta = require('../utils/meta');
const compilers = require('../utils/compilers').compilers;
const { rejectPrebuild, isDataFile } = require('../utils/filters');
const { calculateDestination, calculateDataKey, calculateDataValue } = require('../utils/items');
const { data } = require('autoprefixer');

/**
 * Reads the content of a file to extract the font matter attributes and anything else.
 * Traverses the collections of files collected before, including directories
 *
 * @param {*} file a collected object representing a file in disk
 * @param {*} items the collection where to store the extracted information
 * @returns {object} attributes with default placeholders for content combined with thouse found
 */
const prebuild = (item, items) => {
  const result = {
    item,
    compile_method: '',
  };

  const data_result = { item: '', value: null, key: '' };

  if (rejectPrebuild(item)) {
    logger.log(`Ignoring ${item.shortPath}`);
    return items;
  }

  if (isDataFile(item)) {
    data_result.item = item;
    data_result.key = calculateDataKey(item);
    data_result.value = calculateDataValue(item);
    items.data[data_result.key] = data_result;
  } else {
    result.destination = calculateDestination(item);
    result.compile_method = compilers(item);

    items.files.push(result);
  }

  return items;
};

/**
 * Combines stats and metadata to extract as much information before processing
 *
 * @param {*} project
 * @returns {object} items with keys { styles, scripts, files, data, }
 */
const run = (project) => {
  const promise = new Promise((resolve, reject) => {
    if (!project.collected || !project.collected.include) {
      logger.error('Missing collected property in project at extract step');
      return reject();
    }

    /**
     * Contains all the files, the keys are the path where it will be written.
     * items with matching urls will be overwritten by others processed later
     * is not a bug but it can confuse people
     */
    const items = {
      styles: {},
      scripts: {},
      files: [],
      data: {
        site: project.config,
        head: {},
        // additional keys added by extraction process
      },
    };

    project.extracted.theme.map((c) => {
      prebuild(c, items);
    });

    project.extracted.copy.map((c) => {
      prebuild(c, items);
    });

    project.extracted.include.map((c) => {
      prebuild(c, items);
    });

    project.prebuilt = items;

    return resolve(project);
  });

  return promise;
};

module.exports = {
  run,
};
