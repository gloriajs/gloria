const $log = require('../utils/logger');
const chalk = require(`chalk`);
const express = require('express');
const path = require('path');
const watch = require('node-watch');
const Project = require('../core/project');
const project = new Project;
const build = require(`./build`);
const open = require('open');
const root = process.cwd();

const initializeSite = function (dest) {
    $log.log(`Preparing to serve static files from: ${root}${path.sep}${dest}`);
    return express();
};

const serveStaticAssets = function (app, dest) {
    return app.use(express.static(`${root}${path.sep}${dest}`));
};

const setRoutes = function (app, dest) {
    return app.all('*', (req, res, next) => {
        $log.log('loading: ', req.originalUrl);
        res.sendFile(`${root}${path.sep}${dest}/404.html`);
    });
};

const serveAndBuildSite = function (argv, dest) {

    const app = initializeSite(dest);
    argv.dest = dest;
    build.handler(argv);
    serveStaticAssets(app, dest);
    setRoutes(app, dest);
    return app;
};

const watchSourceFiles = function (dest, argv) {
    const ignore = new RegExp(`node_modules|${dest}|\.git`);
    $log.info(chalk.cyan(`Watching ${root} folder, ignoring ${ignore}`));
    watch(root, {
        filter: (name) => (!ignore.test(name)),
    }, (file) => {
        $log.log(`File`, file, ` changed`);
        try {
            build.handler(Object.assign({ save: false }, argv));
        } catch (e) {
            $log.log('Failed building project');
            $log.log(e);
        }
    });
};

const launchSite = function (argv, app, dest) {

    // Using an arbitrary number to wait for files to build
    setTimeout(() => {
        if (argv.watch === true) {
            watchSourceFiles(dest, argv);
        }

        app.listen(argv.port, function () {
            $log.warn(chalk.green(`Serving static files from ${root}${path.sep}${dest}`));
            $log.warn(chalk.bold.red`Never use this in production. See the deployment section
    in the documentation for more information about deployment.`);
            $log.warn(chalk.green(`listening in port ${argv.port}`));
            if (!argv.suppressBrowser) {open('http://localhost:' + argv.port);}
        });
    }, 1 * 1000);
};

const handler = function (argv) {
    argv = argv || {};
    if (argv.silent) {
        $log.silent();
    }

    const options = project.loadConfig('yaml');
    const dest = project.config.dest || argv.dest;
    const app = serveAndBuildSite(argv, dest);
    launchSite(argv, app, dest);
};

const builder = {
    dest: {
        default: `site`,
        description: `Destination path or folder to serve the site from.`,
    },
    port: {
        default: '3300',
        description: `Port on which to serve the site.`,
    },
    'suppress-browser': {
        default: false,
        description: `Don't open the browser automatically.`,
        type: 'boolean',
        alias: 'b',
    },
    watch: {
        default: true,
        description: `Watchs the source files for changes, and re-builds the site.`,
        alias: 'w',
        type: 'boolean',
    },
    clear: {
        default: false,
        description: `Removes the current content of the source directory`,
        alias: 'c',
        type: 'boolean',
    },
    silent: {
        default: false,
        description: `Limit the amount of output to the console.`,
        alias: 's',
        type: 'boolean',
    },
};

module.exports = {
    command: `serve [dest]`,
    aliases: [],
    describe: `Serves the site from the last known destination, or from the specific folder given.`,
    builder: builder,
    handler: handler,
    serveAndBuildSite: serveAndBuildSite,
    initializeSite: initializeSite,
    serveStaticAssets: serveStaticAssets,
    setRoutes: setRoutes,
    watchSourceFiles: watchSourceFiles,
    launchSite: launchSite,
};
