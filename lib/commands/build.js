const S = require(`string`);
const fs = require('../utils/fs');
const fse = require('fs-extra');
const path = require('path');

const Project = require('../core/project');
const chalk = require(`chalk`);

function handler (argv) {
    const project = new Project();
    const root = process.cwd();
    const public_folder = `${root}/public`;
    const dest = `${root}/${argv.dest}`;

    if ( S(argv.dest).include('..') ) {
        console.error(`Won't build to a parent directory, mostly security reasons. Happy to take a look if you open an issue.`);
        return null;
    }
    const config = project.loadConfig(`yaml`);
    if (!config) {
        console.error(`_config.yml not found, won't build.`);
        return null;
    }
    if (argv.clear === true) {
        console.log(`Clearing dest directory ${dest}.`);
        fs.emptyDirSync(dest);
    }

    const files = [];
    const public = [];

    fse.walk(`${root}`).on('data', function (item) {
        if (S(item.path).include(dest)) return;

        item.isDirectory = item.stats.isDirectory();
        item.shortPath = S(item.path).chompLeft(root).s;
        item.name = path.basename(item.path);
        item.basePath = S(item.shortPath).chompRight(item.name).s;

        if (S(item.path).include(public_folder)) {
            return public.push(item);
        }
        files.push(item);
    })
    .on('end', function () {
        console.log(files);
        console.log(public);
    });

    public.forEach(function(val, idx) {
        // will copy every file from the public folder to site, expanding the path
    });
    files.forEach(function(val, idx) {
        // will render every item that has to, probably using handlebars, then will copy it to the destination expanding the path
    });
    console.log(chalk.green(`Successfully built to '${argv.dest}'`));
}

const builder = {
  dest: {
    default: `site`,
    description: `Destination path or folder to build the site, by default it use a site.`
  },
  clear: {
      default: false,
      description: `When true it will first empty the destination folder.`
  }
}

module.exports = {
    command: `build [dest]`,
    aliases: [],
    describe: `Builds the site into the desired destination.
    By default it will use a folder name 'site' in the root directory of the project.
    It won't build to a parent folder.
    The command will fail if _config.yml is invalid or not present.`,
    builder: builder,
    handler: handler
}
