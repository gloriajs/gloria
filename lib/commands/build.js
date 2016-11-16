const S = require(`string`);
const fs = require('../utils/fs');
const fse = require('fs-extra');
const path = require('path');
const $q = require('q');
const chalk = require(`chalk`);

const Project = require('../core/project');
const project = new Project;

//@todo: let the user select their preferred template engine
const Handlebars = require('handlebars');
var markdown = require( "markdown" ).markdown;

function copyPublicFiles(public, dest) {
    public.forEach( function (val) {
        if (val.isDirectory) {
            console.log(`Creating dir ${dest}${val.shortPath}`);
            fs.copySync(val.path, `${dest}${val.basePath}`);
            return;
        }
        console.log(`Copying`, val.path, ` to ${dest}${val.basePath}${val.name}`);
        fs.copySync(val.path, `${dest}${val.basePath}${val.name}`);
    });
    console.log(chalk.green(`Copied ${public.length} public files.`));
    return public;
}

function processFiles (files, dest, args) {
    const root = process.cwd();
    const result = {
        html: 0,
        md: 0,
        css: 0,
        js: 0,
        others: 0,
    };
    const data = {
        site: project.config,
        args: args
    };

    files.forEach(function (file) {
        if (file.extension === '.html') {
            result.html++;
            fs.readFile(file.path, `utf-8`, function (err, content) {
                if (err) throw err;
                let template = Handlebars.compile(content);
                let result = template(data);
                fs.writeFile(`${dest}${file.basePath}${file.name}`, result, function (err, r) {
                    if (err) throw err;
                    console.log(`Processed html file: ${dest}${file.basePath}${file.name}`)
                });
            });
            return;
        }
        if (file.extension === '.md') {
            fs.readFile(file.path, `utf-8`, function (err, content) {
                if (err) throw err;
                let html = markdown.toHTML(content);
                let template = Handlebars.compile(html);
                let result = template(data);
                let newname = file.name.replace(/\.md$/,'.html');
                fs.writeFile(`${dest}${file.basePath}${newname}`, result, function (err, r) {
                    if (err) throw err;
                    console.log(`Processed markdown file: ${dest}${file.basePath}${newname}`)
                });
            });
        }
        console.log(`Copying`, file.path, ` to ${dest}${file.basePath}${file.name}`);
        if (file.path !== root && file.name !== `_config.yml`) {
            fs.copySync(file.path, `${dest}${file.basePath}${file.name}`);
        }
    });

}

function handler (argv) {
    const root = process.cwd();
    const public_folder = `${root}/public`;
    if ( S(argv.dest).include('..') ) {
        console.error(`Won't build to a parent directory, mostly security reasons. Happy to take a look if you open an issue.`);
        return null;
    }
    const config = project.loadConfig(`yaml`);
    let dest = argv.dest ? argv.dest : (project.config.dest ? project.config.dest : 'site');
    dest = `${root}/${dest}`;
    if (!config) {
        console.error(`_config.yml not found, won't build.`);
        return null;
    }
    project.change({dest: argv.dest});
    project.saveYAML(true, root);
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
        item.extension = path.extname(item.path);``

        if (S(item.path).include(public_folder)) {
            return public.push(item);
        }
        files.push(item);
    })
    .on('end', function () {
        copyPublicFiles(public, dest);
        processFiles(files, dest, argv);
    });
}

const builder = {
  dest: {
    default: ``,
    description: `Destination path or folder to build the site, by default it uses 'site'.`
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
