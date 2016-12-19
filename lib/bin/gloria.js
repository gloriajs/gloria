process.bin = process.title = `gloria`;

// Using yargs to identify commands and arguments
// https://www.npmjs.com/package/yargs
require(`yargs`)
.commandDir(`../commands`, {
    extensions: ['js', 'ts'],
})

.alias('v', 'version')
.version(require(`../version`))

.alias('h', 'help')
.help()

.usage(`Gloria is a static site generator. Use the command init to get started.`)
.epilogue(`For more information, check out the documentation in github.com/gloriajs/gloria`)
.showHelp()
.argv;
