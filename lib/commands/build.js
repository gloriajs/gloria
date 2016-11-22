const S = require(`string`);
const fs = require('../utils/fs');
const fse = require('fs-extra');
const path = require('path');
const $q = require('q');
const chalk = require(`chalk`);
const fm = require('front-matter');

const Project = require('../core/project');
const project = new Project;
const root = process.cwd();

const Render = require(`../build/render`);

function copyPublicFiles(publicFolder, dest) {
    const public = project.public || [];
    fs.copySync(publicFolder, `${dest}`);
    console.log(chalk.green(`Copied ${public.length} public files.`));
    return public;
}

/**
 * Copies public files to the destination folder, and extracts pages so they can
 * be rendered.
 * @param {Array[]} files - The list of files that resulted from fse.walk.
 * @param {string} dest - The folder where they site will be build to.
 * @param {Object} data - The metadata and info needed to parse the content.
 * @param {Array[]} arr - The property of the project where the pages will be pushed to.
 */
function sortFiles(files, dest, data, arr) {
    var result = arr || [];

    files.forEach(function (file, index) {
        if (typeof Render[file.extension] === 'function') {
            result[file.extension] = result[file.extension] ? result[file.extension] + 1 : 1;
            let content = Render.extract(file);
            if (content.fm.ignore) {
                return;
            }

            fse.ensureDirSync(`${dest}${content.destination.folder}`);
            let page = Object.assign({}, file, {
                content: content.content,
                destination: `${dest}${content.destination.folder}${content.destination.file}`,
                data: content.fm,
                type: file.extension,
            });
            result.push(page);
            return;
        }

        if (file.path !== root) {
            console.log(`Copying`, file.path, ` to ${dest}${file.basePath}${file.name}`);
            project.count.others++;
            fs.copySync(file.path, `${dest}${file.basePath}${file.name}`);
            return;
        }
    });

    return result;
}

function processFiles(dest, args) {
    const files = project.files || [];
    const data = {
        site: project.config,
        args: args,
    };
    const results = [];

    project.styles.forEach((item) => {
        let result = Render.renderStyles(item, dest);
        fse.ensureDirSync(`${dest}/sass`);
        fse.writeFile(`${dest}/sass/${item.name.replace('scss', 'css')}`, result.css.css, (err) => {
            if (err) throw err;
            console.log(`file ${root}/sass/${item.name} written`);
        });
    });

    // created a separate function to diff pages and posts Issue:12
    project.pages = sortFiles(files, dest, data, project.pages);
    project.pages.forEach((page, index) => {
        results.push(Render[page.type](page, data));
    });

    results.forEach((page) => {
        let destination = `${dest}${page.destination.folder}${page.destination.file}`;
        fse.writeFile(`${destination}`, page.content, (err) => {
            if (err) throw err;
            console.log(`file ${destination} written`);
        });
    });

    return;
}

function handler(argv) {
    const publicFolder = `${root}/_public`;
    const includesFolder = `${root}/_includes`;
    const layoutsFolder = `${root}/_layout`;
    const sassFolder = `${root}/_sass`;

    if (S(argv.dest).include('..')) {
        console.error(`Won't build to a parent directory, mostly security reasons.
        Happy to take a look if you open an issue.`);
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

    project.files = project.files || [];
    project.public = project.public || [];
    project.includes = project.includes || [];
    project.posts = project.posts || [];
    project.layouts = project.layouts || [];
    project.styles = project.styles || [];

    fse.walk(`${root}`).on('data', function (item) {
        if (S(item.path).include(dest)) return;

        item.isDirectory = item.stats.isDirectory();
        item.shortPath = S(item.path).chompLeft(root).s;
        item.name = path.basename(item.path);
        item.basePath = S(item.shortPath).chompRight(item.name).s;
        item.extension = path.extname(item.path);

        if (argv.git === false && item.shortPath.startsWith(`/.git`) && item.name !== `.gitignore`) {
            return;
        }

        if (S(item.shortPath).startsWith(`/_`)) {
            if (S(item.path).include(publicFolder)) {
                return project.public.push(item);
            }

            if (S(item.path).include(includesFolder) && !item.isDirectory) {
                return project.includes.push(item);
            }

            if (S(item.path).include(layoutsFolder) && !item.isDirectory) {
                return project.layouts[item.name.replace(item.extension, '')] = item;
            }

            if (S(item.path).include(sassFolder) && !S(item.name).startsWith(`_`)) {
                console.log(`processing sass file`, item.name);
                project.styles.push(item);
            }

            console.log(`ignoring ${item.shortPath}`);
            return;
        }

        project.files.push(item);
    }).on('end', () => {
        fs.stat(publicFolder, (err, stats) => {
            if (!err && stats.isDirectory()) copyPublicFiles(publicFolder, dest);
        });

        Render.registerPartials(project.includes);
        Render.registerLayouts(project.layouts);
        processFiles(dest, argv);
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
    git: {
        default: false,
        description: `By default it will ignore the .git directory.
            I don't see a reason why would you include it, but if you want to use --git=true.`,
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
