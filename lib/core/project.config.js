const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const yaml = require(`yamljs`);
const fs = require(`../utils/fs`);
const path = require('path');
const chalk = require('chalk');

const loadConfigFromYamlFile = () => {
    var root = process.cwd();
    if (!fs.existsSync(path.normalize(`${root}/_config.yml`))) {
        logger.warn(chalk.red(`${root}/_config.yml was not found`));
        return {};
    }

    const config = yaml.load(path.normalize(`${root}/_config.yml`));

    return config;
};

/**
 * Call to read project configuration information from the defaults and the config files
 *
 * @returns {object} configuration settings for the project
 */
const get = () => {
    const defaultConfig = {
        include: [
            'pages',
        ],
        name: 'Slava',
        tagline: 'A website generated with gloriaJs',
        author: 'gloriajs',
        dest: 'build',
        copy: [],
        exclude: [
            '.draft.md',
        ],
        css: 'tailwind',
        version: '2.0.4',
    };

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
};
