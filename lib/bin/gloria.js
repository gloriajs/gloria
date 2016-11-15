process.bin = process.title = 'gloria';

var version = require('../version');

var argv = require('yargs')
.version(version)
.argv;
