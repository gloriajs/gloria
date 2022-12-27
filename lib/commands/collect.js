
const klaw = require('klaw');
const $q = require('q');
const logger = require('../utils/logger');

const _klaw = (path, items, config) => {
    const promise = new Promise(function (resolve, reject) {
        klaw(path)
            .on('data', item => {

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

// Actual collect file that the bin file calls after it processed the arguments or whatever
const run = (project) => {

    const promiseArray = [];

    const items = {
        include: [],
        copy: [],
        styles: [],
    };

    project.config.include.map((path) => {
        promiseArray.push(_klaw(path, items.include, project.config));
    });

    project.config.copy.map((path) => {
        promiseArray.push(_klaw(path, items.copy, project.config));
    });

    return $q.all(promiseArray).then(() => {
        project.collected = items;
        console.log({ items });
        return project;
    });
};

module.exports = {
    run,
};
