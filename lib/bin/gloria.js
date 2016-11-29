process.bin = process.title = `gloria`;

// Using yargs to identify commands and arguments
// https://www.npmjs.com/package/yargs
require(`yargs`)
.commandDir(`../commands`)
.version(require(`../version`))
.help()
.epilogue(`For more information, check out the documentation in github.com/gloriajs/gloria`)
.argv;
