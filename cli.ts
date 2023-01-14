#!/usr/bin/env node

import launch from './commands';

const argv = launch(process.argv).argv;

console.log({ argv });
