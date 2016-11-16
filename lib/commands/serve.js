const S = require(`string`);
const fs = require('../utils/fs');
const fse = require('fs-extra');
const path = require('path');
const $q = require('q');
const chalk = require(`chalk`);
const express = require('express');

const Project = require('../core/project');
const project = new Project;



function handler (argv) {
    let options = project.loadConfig('yaml');
    let dest = argv.dest ? argv.dest : (project.config.dest ? project.config.dest : 'site');
    console.log(`prearing to serve files from ${dest}`);
    let app = express()

    app.use(express.static(dest));
    app.all('*', function (req, res, next) {
        console.log('loading ... ', req);
        next(); 
    });
    app.listen(argv.port, function () {
        console.log(`listening in port ${argv.port}:`);
    });
}

const builder = {
  dest: {
    default: `site`,
    description: `Destination path or folder to serve the site from.`
  },
  port: {
      default: '3300'
  }
}

module.exports = {
    command: `serve [dest]`,
    aliases: [],
    describe: `Serves the site from the last known destination, or from the specific folder given.`,
    builder: builder,
    handler: handler
}
