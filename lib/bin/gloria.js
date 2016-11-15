process.bin = process.title = 'gloria';

var argv = require('yargs')
.command('init', 'Initializes a new site the given parameters')
.argv;

var version = require('../version');

if (argv.version || argv.v) {
    process.stdout.write(version + '\n');
    process.exit();
}
