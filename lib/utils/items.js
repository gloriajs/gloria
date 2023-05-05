const YAML = require('yaml');

/**
 * Reads from the available information and generates a string where the file goes
 * @param {*} item
 * @param {string} item.destination.path
 * @param {string} item.destination.file
 * @returns {string} destination to write content to
 */
const calculateDestination = (item) => {
  const { destination } = item;
  const { path, file } = destination;

  if (item.shortPath.endsWith('CNAME')) {
    return 'CNAME';
  }

  if (!path && !file) {
    return '';
  }

  if (!path) {
    return '' + file;
  }

  if (typeof path !== 'string') {
    return '';
  }

  if (typeof path === 'string' && typeof file === 'string') {
    return `${destination.path.replace(/\/$/, '')}/${destination.file}`.replace(
      /\/$/,
      '',
    );
  }

  return 'index.html';
};

/**
 * Reads from the available information and generates a string where the file goes
 * @param {*} item
 * @param {string} item.destination.path
 * @param {string} item.destination.file
 * @returns {string} destination to write content to
 */
const calculateDataKey = (item) => {
  const { destination } = item;
  const { path } = destination;

  return path.replace(/(\.json|\.yml)$/, '');
};

/**
 * Reads from the available information and generates a string where the file goes
 * @param {*} item
 * @param {string} item.destination.path
 * @param {string} item.destination.file
 * @returns {string} destination to write content to
 */
const calculateDataValue = (item) => {
  const { content } = item;
  let parsed = {};

  if (item.shortPath.endsWith('.json')) {
    parsed = JSON.parse(content);
  }

  if (item.shortPath.endsWith('.yml')) {
    parsed = YAML.parse(content);
  }

  return parsed;
};

module.exports = {
  calculateDestination,
  calculateDataKey,
  calculateDataValue,
};
