const $log = require('winston');
const $q = require(`q`);
const yaml = require(`yamljs`);
const fs = require(`../utils/fs`);
const chalk = require(`chalk`);

function Project (config) {
    this.config = config || {};
    this.pages = [];
    this.posts = [];
    this.count = {
        others: 0,
    };
}

Project.prototype.getConfig = function (format) {
    if (format === 'yaml') {
        return yaml.stringify(this.config, 4);
    }
};

Project.prototype.loadConfigFromYamlFile = function () {
    var root = process.cwd();
    if (!fs.existsSync(`${root}/_config.yml`)) {
        $log.error(chalk.red(`${root}/_config.yml was not found`));
        throw (`_config.yml not found.`);
    }

    const config = yaml.load(`${root}/_config.yml`);
    this.config = config;
    return config;
};

Project.prototype.loadConfig = function (format) {
    if (format === 'yaml') {
        return this.loadConfigFromYamlFile();
    }

};

Project.prototype.getLocation = function () {
    if (!this.config.location) {
        throw 'invalid location in configuration';
    }

    return `${process.cwd()}/${this.config.location}`;
};

Project.prototype.change = function (options) {
    Object.assign(this.config, options);
    return options;
};

Project.prototype.saveYAML = function (force, location) {
    const deferred = $q.defer();
    location = location || this.getLocation();
    $log.log(`Saving configuration to file ${location}/_config.yml`);
    if (fs.existsSync(`${location}/_config.yml`) && force !== true) {
        return $q.reject({ error: `Project exist, won't override` });
    }

    fs.writeFileSync(`${location}/_config.yml`, this.getConfig(`yaml`), { flag: 'w' });
    return $q.when({});
};

Project.prototype.create = function (options) {
    options = options || {};
    const _this = this;
    const deferred = $q.defer();
    let layout = _this.config.layout || 'default';
    layout = `${__dirname}/../../layouts/${this.config.layout}/`;
    var location = this.getLocation();

    if (!_this.config) {
        return $q.reject({ error: `Invalid configuration data` });
    }

    if (!_this.config.location) {
        return $q.reject({ error: `Invalid location given` });
    }

    if (fs.existsSync(`${_this.config.location}/_config.yml`) && options.force !== true) {
        return $q.reject({ error: `Project exist, won't override` });
    }

    if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
        $log.log(`Created new folder ${location}`);
    }

    if (!fs.existsSync(layout)) {
        return $q.reject({ error: `Selected layout ${_this.config.layout} doesn't exist` });
    }

    fs.copy(layout, location).then(function (err) {
        if (err) {
            return deferred.reject({ error: `failed copying layout files`, err: err });
        }

        $log.log(`Copied layout files into project folder.`);
        _this.saveYAML(options.force);
        deferred.resolve();
    });

    return deferred.promise;
};

module.exports = Project;
