const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const yaml = require(`yamljs`);
const fs = require(`../utils/fs`);
const path = require('path');
// import chalk = require('chalk');

const loadConfigFromYamlFile = () => {
  var root = process.cwd();
  if (!fs.existsSync(path.normalize(`${root}/_config.yml`))) {
    //require(`yargs`)
    logger.warn(`${root}/_config.yml was not found`);
    return {};
  }

  const config = yaml.load(path.normalize(`${root}/_config.yml`));

  return config;
};

const writeConfigToYamlFile = (config, overwrite = false) => {
  var root = process.cwd();
  const configPath = path.normalize(`${root}/_config.yml`);

  if (!fs.existsSync(configPath)) {
    //require(`yargs`)
    logger.warn(`${root}/_config.yml already exists`);
    return {};
  }

  const configString = yaml.stringify(config);

  fs.writeFile(path.normalize(`${root}/_config.yml`), configString, (err) => {
    if (err) {
      return logger.error(err);
    }
    logger.log('_config.yml was created!');
  });
  return {};
};

const defaults = {
  include: ['pages'],
  name: 'Slava',
  tagline: 'A website generated with gloriaJs',
  author: 'gloriajs',
  dest: 'build',
  copy: ['public'],
  exclude: ['.draft.md'],
  theme: ['layouts/tailwind'],
  css: 'tailwind',
  engine: 'default',
  version: '2',
};

/**
 * Call to read project configuration information from the defaults and the config files
 *
 * @returns {object} configuration settings for the project
 */
const get = () => {
  const defaultConfig = defaults;
  const yamlConfig = loadConfigFromYamlFile();

  /**
   * Configuration settings for the project.
   * Combined settings from defaults and _config.yml
   */
  const config = {
    _hash: uuidv4(),
    ...defaultConfig,
    ...yamlConfig,
  };

  return config;
};

module.exports = {
  get: get,
  getYaml: loadConfigFromYamlFile,
  writeYaml: writeConfigToYamlFile,
  defaults,
};
