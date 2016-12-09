process.bin = process.title = `gloria`;

// Using yargs to identify commands and arguments
// https://www.npmjs.com/package/yargs
require(`yargs`)
.commandDir(`../commands`, {
    extensions: ['js', 'ts'],
})
.version(require(`../version`))
.usage(`Gloria is a static site generator. Use the command init to get started.`)
.help()
.epilogue(`For more information, check out the documentation in github.com/gloriajs/gloria`)
.argv;
