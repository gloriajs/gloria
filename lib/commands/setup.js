const $q = require('q');
const logger = require('../utils/logger');
const config = require('../core/project.config');
const root = process.cwd();
const path = require('path');

// Actual collect file that the bin file calls after it processed the arguments or whatever
const run = (project) => {
  const { writeYaml } = config;

  // @TODO: create folders described in _config files to avoid errors during first run

  writeYaml(project.config);
  logger.log(project.config);
  return $q.resolve();
};

module.exports = {
  run,
};
