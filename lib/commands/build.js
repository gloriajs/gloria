const S = require(`string`);
const fs = require('../utils/fs');
const fse = require('fs-extra');
const path = require('path');
const $q = require('q');
const chalk = require(`chalk`);
const fm = require('front-matter');

const Project = require('../core/project');
const project = new Project;

const Render = require(`../build/render`);

function copyPublicFiles(public, publicFolder, dest) {
    fs.copySync(publicFolder, `${dest}`);
    console.log(chalk.green(`Copied ${public.length} public files.`));
    return public;
}

function processFiles(files, dest, args) {
    const root = process.cwd();
    const result = {};
    const data = {
        site: project.config,
        args: args,
    };

    files.forEach(function (file) {
        if (typeof Render[file.extension] === 'function') {
            result[file.extension] = result[file.extension] ? result[file.extension] + 1 : 1;
            let content = Render['.html'](file, data);
            fse.ensureDirSync(`${dest}${content.destination.folder}`);
            fse.writeFile(`${dest}${content.destination.folder}${content.destination.file}`, content.content, function (err, r) {
                if (err) throw err;
                console.log(`Processed ${file.extension} file: ${dest}${content.destination.folder}${content.destination.file}`);
            });

            return;
        }

        if (file.path !== root && file.name !== `_config.yml`) {
            console.log(`Copying`, file.path, ` to ${dest}${file.basePath}${file.name}`);
            result.others++;
            fs.copySync(file.path, `${dest}${file.basePath}${file.name}`);
            return;
        }

    });
}

function handler(argv) {
    const root = process.cwd();
    const publicFolder = `${root}/_public`;
    if (S(argv.dest).include('..')) {
        console.error(`Won't build to a parent directory, mostly security reasons. Happy to take a look if you open an issue.`);
        return null;
    }

    const config = project.loadConfig(`yaml`);
    let dest = argv.dest ? argv.dest : (project.config.dest ? project.config.dest : 'site');
    project.change({ dest: dest });
    project.saveYAML(true, root);
    dest = `${root}/${dest}`;
    if (!config) {
        console.error(`_config.yml not found, won't build.`);
        return null;
    }
    if (argv.clear !== false) {
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
        item.extension = path.extname(item.path);

        if (S(item.shortPath).startsWith(`/_`)) {
            if (S(item.path).include(publicFolder)) {
                return public.push(item);
            }

            console.log(`ignoring ${item.shortPath}`);
            return;
        }

        files.push(item);
    })
    .on('end', function () {
        copyPublicFiles(public, publicFolder, dest);
        processFiles(files, dest, argv);
    });
}

const builder = {
    dest: {
        default: ``,
        description: `Destination path or folder to build the site, by default it uses 'site'.`,
    },
    clear: {
        default: true,
        description: `When different to false, it will not 
            overwrite other files in the dest folder.`,
    },
};

module.exports = {
    command: `build [dest]`,
    aliases: [],
    describe: `Builds the site into the desired destination.
    By default it will use a folder name 'site' in the root directory of the project.
    It won't build to a parent folder.
    The command will fail if _config.yml is invalid or not present.`,
    builder: builder,
    handler: handler,
};
