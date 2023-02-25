process.bin = process.title = `gloria`;
const version = require('../version');
const yargs = require(`yargs`);

/**
 * @name init
 * @description uses yargs to enable the commands available
 */
const init = () => {
  yargs
    .commandDir(`./commands`, {
      extensions: ['js', 'ts'],
    })
    .alias('v', 'version')
    .version(version)
    .help()
    .usage(
      `Gloria is a static site generator. Use the command init to get started.`,
    )
    .epilogue(
      `For more information, check out the documentation in github.com/gloriajs/gloria`,
    ).argv;
};

init();
