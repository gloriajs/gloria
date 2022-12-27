const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _collect = require('../../commands/collect');
const _extract = require('../../commands/extract');
const fs = require('fs');

/**
 * work in progress, always add on top of existing ways and prevent
 * backwards compatibility issues
 *
 * Default include-paths are pages and posts.
 * @param {string} argv.dest If present, write result to destination file
 * @param {string} argv.path If present overrides configuration file
 */
const extract = (argv) => {
    const project = {
        config: config.get(),
        collected: {},
        content: {},
        extracted: {},
    };

    _collect.run(project)
        .then((p) => {
            let b;

            try {
                b = _extract.run(p);
            } catch (e) {
                logger.error(e);
                throw e;
            }

            return b;
        })
        .then((p) => {
            const { config } = p;

            if (argv.dest) {
                const dest = `./${argv.dest}/extracted.${config._hash}.json`;
                const ztring = JSON.stringify(p.extracted);
                fs.writeFileSync(dest, ztring);
            }

            return p;
        });
};

const options = {
    dest: {
        default: null,
        description: `Destination folder to output a json file with results.`,
    },
};

/**
 * Command to read md files and other data and create taxonomy
 */
module.exports = {
    command: `extract [dest] [path]`,
    aliases: [],
    describe: `Traverses the source files and compiles to destination.`,
    builder: options,
    handler: extract,
};