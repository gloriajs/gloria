process.bin = process.title = `gloria`;
const version = require('../version');
const $q = require('q');
const chalk = require('chalk');

/**
 * @name init
 * @description uses yargs to enable the commands available
 */
const init = () => {
    require(`yargs`)
      .commandDir(`./commands`)
      .alias('v', 'version')
      .version(version)
      .help()
      .usage(`Gloria is a static site generator. Use the command init to get started.`)
      .epilogue(`For more information, check out the documentation in github.com/gloriajs/gloria`)
      .argv;
};

init();
