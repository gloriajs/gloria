const logger = require('../../utils/logger');
const config = require('../../core/project.config');
const _copy = require('../../commands/copy');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const root = process.cwd();

/**
 * Normally called as part of another command, but it can be used
 * directly for debugging purposes or faster asset collection.
 *
 * @param {string} argv.dest If present, write result to destination folder
 * @param {string} argv.path If present, override the configuration
 */
const copy = (argv) => {
    const project = {
        config: config.get(),
    };

    if (argv.dest) {
        project.config.dest = argv.dest;
    }

    _copy.run(project)
        .then(project => {
            const { config } = project;

            project.config.copy.map(p => {
                const sourceDir = path.join(root, p);
                const destinationDir = path.join(root, project.config.dest);

                if (!fs.existsSync(destinationDir)) {
                    fs.mkdirSync(destinationDir, { recursive: true });
                }

                fse.copy(sourceDir, destinationDir, function (error) {
                    if (error) {
                        throw error;
                    }
                });

            });

            return project;
        });
};

const options = {
    dest: {
        default: null,
        description: `Destination folder`,
    },
    path: {
        default: null,
        description: 'Ignore the path on configuration and use this folder instead',
    },
};

module.exports = {
    command: `copy [dest] [paths]`,
    aliases: [],
    describe: `Copy the asset files into the output folder.`,
    builder: options,
    handler: copy,
};
