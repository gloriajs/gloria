const klaw = require('klaw');
const $q = require('q');
const logger = require('../utils/logger');
const fm = require('front-matter');
const path = require('path');
const fse = require('fs-extra');
const moment = require('moment');

const extract = (c, items) => {

    const stat = fse.statSync(c.path);

    if (stat.isDirectory()) {
        items.push({
            destination: null,
            content: null,
            stat,
            isDir: true,
        });
        return;
    }

    let content = ``;
    try {
        content = fse.readFileSync(c.path, `utf-8`);
    } catch (err) {
        if (err) { throw err; }
    }

    content = fm(content);
    const timestamp = moment.utc(content.date ? content.date : stat.birthtime).format('X');

    const destination = {
        folder: '',
        file: path.basename(c.path),
    };

    const a = {
        destination: destination,
        content: content.body,
        stat,
        fm: { timestamp, ...(content.attributes) },
    };

    items.push(a);
    return items;
};

/**
 * Extracts the metadata from files and creates a taxonomy
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
        };

        project.collected.include.map((c) => {
            extract(c, items.include);
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
