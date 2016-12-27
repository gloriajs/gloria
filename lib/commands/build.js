const $log = require(`../utils/logger`);
const S = require(`string`);
const fs = require(`../utils/fs`);
const fse = require(`fs-extra`);
const path = require(`path`);
const $q = require(`q`);
const chalk = require(`chalk`);
const fm = require(`front-matter`);

const Project = require(`../core/project`);
const project = new Project;
project.loadConfig(`yaml`);

const root = process.cwd();

const Render = require(`../build/render`);

const publicFolder = `_public`;
const includesFolder = `_includes`;
const layoutsFolder = `_layout`;
const sassFolder = `_sass`;
const stylusFolder = `_stylus`;
const postsFolder = `_posts`;
const dataFolder = `_data`;
const themesFolder = path.normalize(`${root}/themes`);
const themeFolder = path.normalize(`${themesFolder}/${project.config.theme}`);

function copyPublicFiles (publicFolder, dest) {
    const publicFiles = project.public || [];
    fs.copySync(publicFolder, `${dest}`);
    $log.log(chalk.green(`Copied ${publicFiles.length} public files.`));
    return publicFiles;
}

/**
 * Copies public files to the destination folder, and extracts pages so they can
 * be rendered.
 * @param {Array[]} files - The list of files that resulted from fse.walk.
 * @param {string} dest - The folder where they site will be build to.
 * @param {Object} data - The metadata and info needed to parse the content.
 */
function sortFiles (files, dest, data) {
    const result = [];
    files.forEach(function (file, index) {
        if (typeof Render[file.extension] === 'function') {
            result[file.extension] = result[file.extension] ? result[file.extension] + 1 : 1;
            const content = Render.extract(file);
            if (content.fm.ignore) {
                return;
            }

            fse.ensureDirSync(`${dest}${content.destination.folder}`);
            const page = Object.assign({}, file, content.fm, {
                content: content.content,
                destination: `${dest}${content.destination.folder}${content.destination.file}`,
                data: content.fm,
                type: file.extension,
            });
            result.push(page);
            return;
        }

        if (file.path !== root) {
            $log.log(`Copying`, file.path, ` to ${path.normalize('dest/file.basePath/file.name')}`);
            project.count.others++;
            fs.copySync(file.path, path.normalize(`${dest}/${file.basePath}/${file.name}`));
            return;
        }
    });

    return result;
}

function sortPosts (files, dest, data) {
    const posts = sortFiles(files, dest, data);
    posts.forEach((post, index, arr) => {
        post.data.layout = post.data.layout || 'post';
        const url = S(post.data.url).slugify().s;
        const category = post.data.category === undefined || post.data.category === null ?
            S(post.data.category).slugify().s : ``;
        post.url = path.normalize(`/blog/${category}/${url}`);
        arr[index] = post;
    });
    return posts;
}

function processFiles (dest, args) {
    const files = project.files || [];
    const posts = project.posts || [];

    const data = {
        site: project.config,
        args: args,
        data: {},
    };
    const results = {
        pages: [],
        posts: [],
    };

    project.styles.forEach((item) => {
        const result = Render.renderStyles(item, dest);
        fse.ensureDirSync(`${dest}/sass`);
        fse.writeFile(`${dest}${path.sep}sass${path.sep}${item.name.replace('scss', 'css')}`,
        result.css.css, (err) => {
            if (err) {throw err;}
            $log.log(`file ${root}${path.sep}sass${path.sep}${item.name} written`);
        });
    });

    project.stylus.forEach((item) => {
        const result = Render.renderStylus(item, dest);
        fse.ensureDirSync(`${dest}/stylus`);
        fse.writeFile(`${dest}${path.sep}stylus${path.sep}${item.name.replace('.styl', 'css')}`,
        result.css.css, (err) => {
            if (err) {throw err;}
            $log.log(`file ${root}${path.sep}stylus${path.sep}${item.name} written`);
        });
    });

    project.jsondata.forEach((file) => {
        const currentJSON = JSON.parse(fs.readFileSync(`${root}${file.shortPath}`, 'utf8'));
        const name = file.name.replace(/\.json$/, '');
        data.data[name] =  currentJSON;
    });

    // created a separate function to diff pages and posts Issue:12
    project.pages = sortFiles(files, dest, data);
    project.posts = sortPosts(posts, dest, data);
    data.posts = project.posts;
    project.pages.forEach((page, index) => {
        results.pages.push(Render[page.type](page, data));
    });

    project.posts.forEach((post, index) => {
        results.posts.push(Render.post(post, data));
    });

    // Wrap all the writefiles in promises and then after promise.all call console.timeEnd
    // and log info
    const promiseArray = [];
    for (const result in results) {
        results[result].forEach((page) => {
            const folder = page.destination.folder || '';
            const destination = path.normalize(`${dest}/${folder}/${page.destination.file}`);
            fse.ensureDirSync(path.normalize(`${dest}/${folder}`));
            if (destination.indexOf('docsarchitect') !== -1) {
                console.error(destination);
            }

            var writeFile = $q.nfbind(fse.writeFile);
            promiseArray.push(writeFile(destination, page.content)
            .then((result) => {
                $log.log(`file ${destination} written`);
            })
            .catch(error => $log.error(error)));
        });
    };

    return $q.all(promiseArray).done(() => {
        $log.timeEnd('Build time');
        $log.log(`# of public files: ${project.public.length}`);
        $log.log(`# of pages: ${project.pages.length}`);
        $log.log(`# of posts: ${project.posts.length}`);
        $log.log(`# of sass: ${project.styles.length}`);
        $log.log(`# of stylus: ${project.stylus.length}`);
        $log.log(`# of JSON: ${project.jsondata.length}`);
    });
}

function handler (argv) {
    $log.time('Build time');
    if (argv.silent) {
        $log.silent();
    }

    if (S(argv.dest).include('..')) {
        $log.error(`Won't build to a parent directory, mostly security reasons.
Happy to take a look if you open an issue.`);
        return null;
    }

    if (argv.dest.lastIndexOf('.', 0) === 0) {
        $log.error(`Won't build to itself, it breaks everything.`);
        return null;
    }

    const config = project.config;
    let dest = argv.dest ? argv.dest : (project.config.dest ? project.config.dest : 'site');
    project.change({ dest: dest });
    if (argv.save) {
        project.saveYAML(true, root);
    }

    dest = `${root}${path.sep}${dest}`;
    if (!config) {
        $log.error(`_config.yml not found, won't build.`);
        return null;
    }

    if (argv.clear !== false) {
        $log.log(`Clearing dest directory ${dest}.`);
        fs.emptyDirSync(dest);
    }

    project.files = [];
    project.public = [];
    project.includes = [];
    project.posts = [];
    project.layouts = [];
    project.styles = [];
    project.stylus = [];
    project.jsondata = [];

    function ignoreFiles (item) {
        const ignoreList = [ 'themes', '.git', '.gitignore' ];
        const basename = path.basename(item);
        const filtered = [];
        filtered.push(basename);
        filtered.push(basename === '.' || basename[0] !== '.');
        filtered.push(item !== dest);
        filtered.push(ignoreList.indexOf(basename) === -1);
        return filtered.indexOf(false) === -1;
    }

    function classifyItems (item) {
        item.isDirectory = item.stats.isDirectory();
        item.shortPath = S(item.path).chompLeft(themeFolder).s;
        item.shortPath = S(item.shortPath).chompLeft(root).s;
        item.name = path.basename(item.path);
        item.basePath = S(item.shortPath).chompRight(item.name).s;
        item.extension = path.extname(item.path);
        if (item.shortPath.lastIndexOf(`${path.sep}_`, 0) === 0) {
            if (S(item.path).include(publicFolder)) {
                return project.public.push(item);
            }

            if (S(item.path).include(postsFolder) && !item.isDirectory) {
                return project.posts.push(item);
            }

            if (S(item.path).include(includesFolder) && !item.isDirectory) {
                return project.includes.push(item);
            }

            if (S(item.path).include(layoutsFolder) && !item.isDirectory) {
                return project.layouts[item.name.replace(item.extension, '')] = item;
            }

            if (S(item.path).include(sassFolder) && !(item.name.lastIndexOf(`_`, 0) === 0)) {
                return project.styles.push(item);
            }

            if (S(item.path).include(stylusFolder) && !(item.name.lastIndexOf(`_`, 0) === 0)) {
                return project.stylus.push(item);
            }

            if (S(item.path).include(dataFolder) && !item.isDirectory) {
                return project.jsondata.push(item);
            }

            return $log.log(`ignoring ${item.shortPath}`);
        }

        project.files.push(item);
    }

    function processSiteFiles () {
        fse.walk(`${root}`, { filter: ignoreFiles})
        .on('data', classifyItems)
        .on('end', () => {
            fs.stat(publicFolder, (err, stats) => {
                if (!err && stats.isDirectory()) {copyPublicFiles(publicFolder, dest);}
            });

            Render.registerPartials(project.includes);
            Render.registerLayouts(project.layouts);
            processFiles(dest, argv);
        });
    }

    function processThemeFiles () {
        fse.walk(path.normalize(themeFolder),  { filter: ignoreFiles})
        .on('data', classifyItems)
        .on('end', () => {
            processSiteFiles();
        });
    }

    $log.log(`Starting to walk the source folder ${root}`);
    fs.stat(themeFolder, (err, stats) => {
        if (!err && stats.isDirectory()) {
            $log.log('The theme folder was found, including it on the build process');
            processThemeFiles();
        }
        if (err) {
            $log.log('No theme folder was found, continuing with the site files');
            processSiteFiles();
        }
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
    save: {
        default: true,
        description: `By default it will save new configuration arguments in the _config file.`,
    },
    silent: {
        default: false,
        description: `Limit the amount of output to the console.`,
        alias: 's',
        type: 'boolean',
    },
    theme: {
        description: `Select what theme is going to be used during the build.`,
        alias: 't',
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
