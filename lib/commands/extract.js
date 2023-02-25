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

/**
 * Reads the content of a file to extract the font matter attributes and anything else.
 * Traverses the collections of files collected before, including directories
 *
 * @param {*} file a collected object representing a file in disk
 * @param {*} items the collection where to store the extracted information
 * @returns {object} attributes with default placeholders for content combined with thouse found
 */
const extract = (file, items) => {
  const stat = fse.statSync(path.normalize(file.path));

  const item = {
    destination: null,
    content: null,
    stat,
    isDir: stat.isDirectory(),
    path: file.path,
    shortPath: S(file.path).chompLeft(root).s,
  };

  if (item.isDir) {
    items.push(item);
    return items;
  }

  let content = ``;
  try {
    content = fse.readFileSync(file.path, `utf-8`);
  } catch (err) {
    if (err) {
      throw err;
    }
  }

  const attrs = meta.read(content);
  const timestamp = moment
    .utc(attrs.date ? attrs.date : stat.birthtime)
    .format('X');

  const destination = {
    file: attrs.permalink ? 'index.html' : '',
    path: attrs.permalink || item.shortPath,
  };

  items.push({
    ...item,
    attrs,
    destination,
    content: attrs.raw.body,
    meta: { timestamp, ...content.attributes },
  });
  return items;
};

/**
 * Combines stats and metadata to extract as much information before processing
 *
 * @param {*} project
 * @returns
 */
const run = (project) => {
  const promise = new Promise((resolve, reject) => {
    if (!project.collected || !project.collected.include) {
      logger.error('Missing collected property in project at extract step');
      return reject();
    }

    const items = {
      include: [],
      theme: [],
      copy: [],
    };

    project.collected.include.map((c) => {
      extract(c, items.include);
    });

    project.collected.copy.map((c) => {
      extract(c, items.copy);
    });

    project.collected.theme.map((c) => {
      extract(c, items.theme);
    });

    project.extracted = items;
    return resolve(project);
  });

  return promise;
};

module.exports = {
  run,
};
