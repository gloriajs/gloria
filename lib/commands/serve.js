const chalk = require(`chalk`);
const express = require('express');
const path = require('path');
const watch = require('node-watch');

const Project = require('../core/project');
const project = new Project;

const build = require(`./build`);
const open = require('open');

function handler(argv) {
    argv = argv || {};
    let options = project.loadConfig('yaml');
    const root = process.cwd();
    let dest = project.config.dest || argv.dest;

    let app = express();
    console.log(`Preparing to serve static files from: ${root}${path.sep}${dest}`);
    argv.dest = dest;
    build.handler(argv);

    app.use(express.static(`${root}${path.sep}${dest}`));
    app.all('*', (req, res, next) => {
        console.log('loading: ', req.originalUrl);
        next();
    });

    // Using an arbitrary number to wait for files to build
    setTimeout(() => {
        let ignore = new RegExp(`${root}${path.sep}${dest}|${root}${path.sep}.git`);
        console.info(chalk.cyan(`Watching ${root} folder, ignoring ${ignore}`));
        watch(root, {
            filter: (name) => (!/node_modules/.test(name) && !ignore.test(name)),
        },  (file) => {
            console.log(`file`, file, ` changed`);
            build.handler(Object.assign({ save: false }, argv));
        });

        app.listen(argv.port, function () {
            console.log(chalk.green(`Serving static files from ${root}${path.sep}${dest}`));
            console.warn(chalk.bold.red`Never use this in production. See the deployment section
    in the documentation for more information about deployment.`);
            console.log(chalk.green(`listening in port ${argv.port}`));
            if (!argv.suppressBrowser) open('http://localhost:' + argv.port);
        });
    }, 1 * 1000);

}

const builder = {
    dest: {
        default: `site`,
        description: `Destination path or folder to serve the site from.`,
    },
    port: {
        default: '3300',
    },
    'suppress-browser': {
        default: false,
    },
};

module.exports = {
    command: `serve [dest]`,
    aliases: [],
    describe: `Serves the site from the last known destination, or from the specific folder given.`,
    builder: builder,
    handler: handler,
};
