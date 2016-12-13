const $log = require('winston');
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

const setRoutes = function (app) {
    return app.all('*', (req, res, next) => {
        $log.log('loading: ', req.originalUrl);
        next();
    });
};

const serveAndBuildSite = function (argv, dest) {

    let app = initializeSite(dest);
    argv.dest = dest;
    build.handler(argv);
    serveStaticAssets(app, dest);
    setRoutes(app);
    return app;
};

const watchSourceFiles = function (dest, argv) {
    let ignore = new RegExp(`${root}${path.sep}${dest}|${root}${path.sep}.git`);
    $log.info(chalk.cyan(`Watching ${root} folder, ignoring ${ignore}`));
    watch(root, {
        filter: (name) => (!/node_modules/.test(name) && !ignore.test(name)),
    }, (file) => {
        $log.log(`file`, file, ` changed`);
        build.handler(Object.assign({ save: false }, argv));
    });
};

const launchSite = function (argv, app, dest) {
    // Using an arbitrary number to wait for files to build
    setTimeout(() => {
        if (argv.watch === true) {
            watchSourceFiles(dest, argv);
        }

        app.listen(argv.port, function () {
            $log.log(chalk.green(`Serving static files from ${root}${path.sep}${dest}`));
            $log.warn(chalk.bold.red`Never use this in production. See the deployment section
    in the documentation for more information about deployment.`);
            $log.log(chalk.green(`listening in port ${argv.port}`));
            if (!argv.suppressBrowser) open('http://localhost:' + argv.port);
        });
    }, 1 * 1000);
};

const handler = function (argv) {
    argv = argv || {};
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
    },
    'suppress-browser': {
        default: false,
    },
    watch: {
        default: true,
        description: `Watchs the source files for changes, and re-builds the site.`,
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
