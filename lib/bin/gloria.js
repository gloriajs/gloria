process.bin = process.title = `gloria`;
const request = require('request-promise');
const semver = require('semver');
const version = require('../version');
const $q = require('q');
const chalk = require('chalk');

const configstore = require('../utils/configstore');
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

function init (data) {
    if (data && semver.gt(data.version, version)) {
        console.log(chalk.red(`------
You're running gloria in version ${version}, 
the latest version is ${data.version}.
Run 'npm install -g gloria' to get the latest version
------`));
    }

    // Using yargs to identify commands and arguments
    // https://www.npmjs.com/package/yargs
    require(`yargs`)
        .commandDir(`../commands`)
        .alias('v', 'version')
        .version(require(`../version`))
        .help()
        .usage(`Gloria is a static site generator. Use the command init to get started.`)
        .epilogue(`For more information, check out the documentation in github.com/gloriajs/gloria`)
        .argv;
}

const latestVersion = configstore.get('latest.version');
const versionFetched = configstore.get('latest.fetched') || 0;
if (latestVersion && versionFetched > Date.now() - ONE_DAY_MS) {
    init({version: latestVersion});
} else {
    console.log('Checking for latest version...');
    const r = request({uri: 'https://registry.npmjs.org/gloria/latest', json: true});
    r.then(function (data) {
        configstore.set('latest.version', data.version);
        configstore.set('latest.fetched', Date.now());
        init(data);
    });
    r.catch(() => init({version: version}));
}
