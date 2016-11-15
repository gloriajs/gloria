const $q = require(`q`);
const yaml = require(`yamljs`);
const fs = require(`../utils/fs`);

function Project(config) {
    this.config = config || {};
}

Project.prototype.getConfig = function (format) {
    if (format === 'yaml') {
        return yaml.stringify(this.config, 4);
    }
}

Project.prototype.loadConfigFromYaml = function () {
// // parse YAML string 
// nativeObject = YAML.parse(yamlString);
// // Load yaml file using YAML.load 
// nativeObject = YAML.load(`myfile.yml`);
}

Project.prototype.getLocation = function () {
    if (!this.config.location) {
        throw 'invalid location in configuration';
    }
    return `${process.cwd()}/${this.config.location}`;
}

Project.prototype.change = function (options) {
    this.config = options;
    return options;
}

Project.prototype.saveYAML = function (force) {
    const deferred = $q.defer();
    var location = this.getLocation();
    console.log(`Saving configuration to file ${location}/_config.yml`);
    if (fs.existsSync(`${location}/_config.yml`) && force !== true) {
        return $q.reject({error: `Project exist, won't override`});
    }
    fs.writeFileSync(`${location}/_config.yml`, this.getConfig(`yaml`), { flag : 'w' });
    return $q.when({});
};

Project.prototype.create = function (options) {
    options = options || {};
    const self = this;
    const deferred = $q.defer();
    let layout = this.config.layout || 'default';
    layout = `${__dirname}/../../layouts/${this.config.layout}/`;
    var location = this.getLocation();

    if (!self.config) {
        return $q.reject({error: `Invalid configuration data`});
    }
    if (!self.config.location) {
        return $q.reject({error: `Invalid location given`});
    }
    if (fs.existsSync(`${self.config.location}/_config.yml`) && options.force !== true) {
        return $q.reject({error: `Project exist, won't override`});
    }
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
        console.log(`Created new folder ${location}`);
    }
    if (!fs.existsSync(layout)) {
        return $q.reject({error: `Selected layout ${self.config.layout} doesn't exist`});
    }
    fs.copy(layout, location).then(function (err) {
        if (err) {
            return deferred.reject({error: `failed copying layout files`, err: err});
        }
        console.log(`Copied layout files into project folder.`);
        self.saveYAML(options.force);
        deferred.resolve();
    });
    return deferred.promise;
}

module.exports = Project;