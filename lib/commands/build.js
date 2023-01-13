const $log = require(`../utils/logger`);
const S = require(`string`);
const fs = require(`../utils/fs`);
const fse = require(`fs-extra`);
const path = require(`path`);
const $q = require(`q`);
const chalk = require(`chalk`);
const fm = require(`front-matter`);
const logger = require('../utils/logger');

const Project = require(`../core/project`);
const project = new Project();
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

// if (file.path !== root && !file.path.isDirectory) {
//     const copyingTo = path.normalize(`${dest}/${file.basePath}/${file.name}`);
//     $log.log(`Copying`, file.path, ` to ${copyingTo}`);
//     project.count.others++;
//     fs.copySync(file.path, path.normalize(`${dest}/${file.basePath}/${file.name}`));

function processFiles(dest, args) {
  // if we use the project files or posts,
  // there will be data duplication when serving
  const files = project.files || [];
  const posts = project.posts || [];

  const data = {
    site: project.config,
    args: args,
    data: {},
    pages: [],
    posts: [],
  };
  const results = {
    pages: [],
    posts: [],
  };

  project.styles.forEach((item) => {
    const result = Render.renderStyles(item, dest);
    const destination = path.normalize(`${dest}/sass/`);
    fse.ensureDirSync(destination);
    fse.writeFile(
      `${destination}${item.name.replace('scss', 'css')}`,
      result.css.css,
      (err) => {
        if (err) {
          throw err;
        }
        $log.log(
          `Style file ${destination}${item.name.replace(
            'scss',
            'css',
          )} written`,
        );
      },
    );
  });

  project.stylus.forEach((item) => {
    const result = Render.renderStylus(item, dest);
    const destination = path.normalize(`${dest}/stylus/`);
    const name = item.name.replace('.styl', 'css');
    fse.ensureDirSync(destination);
    fse.writeFile(`${destination}${name}`, result.css.css, (err) => {
      if (err) {
        throw err;
      }
      $log.log(`Stylus file ${destination}${name} written`);
    });
  });

  project.jsondata.forEach((file) => {
    const source = path.normalize(`${root}${file.shortPath}`);
    const currentJSON = JSON.parse(fs.readFileSync(source, 'utf8'));
    const name = file.name.replace(/\.json$/, '');
    data.data[name] = currentJSON;
  });

  // created a separate function to diff pages and posts Issue:12
  // the forEach fixes issue where the array was passed by reference, and not value, thus
  // when rendering other pages it would alter the data in the project object
  project.pages = sortFiles(files, dest, data);
  project.pages.forEach((page, index) => {
    data.pages.push(page);
  });
  project.posts = sortPosts(posts, dest, data);
  project.posts.forEach((post, index) => {
    data.pages.push(post);
  });
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
      const destination = path.normalize(
        `${dest}/${folder}/${page.destination.file}`,
      );
      fse.ensureDirSync(path.normalize(`${dest}/${folder}`));
      if (destination.indexOf('docsarchitect') !== -1) {
        console.error(destination);
      }

      var writeFile = $q.nfbind(fse.writeFile);
      promiseArray.push(
        writeFile(destination, page.content)
          .then((result) => {
            $log.log(`File ${destination} written`);
          })
          .catch((error) => $log.error(error)),
      );
    });
  }

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

function handler(argv) {
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
  let dest = argv.dest
    ? argv.dest
    : project.config.dest
    ? project.config.dest
    : 'site';
  project.change({ dest: dest });
  if (argv.save) {
    project.saveYAML(true, root);
  }

  dest = path.normalize(`${root}/${dest}`);
  if (!config) {
    $log.error(`_config.yml not found, won't build.`);
    return null;
  }

  if (argv.clear !== false) {
    $log.log(`Clearing dest directory ${dest}.`);
    fs.removeSync(dest);
    fs.ensureDirSync(dest);
  }

  project.files = [];
  project.public = [];
  project.includes = [];
  project.posts = [];
  project.layouts = [];
  project.styles = [];
  project.stylus = [];
  project.jsondata = [];

  function ignoreFiles(item) {
    const ignoreList = ['themes', '.git', '.gitignore'];
    const basename = path.basename(item);
    const filtered = [];
    filtered.push(basename);
    filtered.push(basename === '.' || basename[0] !== '.');
    filtered.push(item !== dest);
    filtered.push(ignoreList.indexOf(basename) === -1);
    return filtered.indexOf(false) === -1;
  }

  function classifyItems(item) {
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
        return (project.layouts[item.name.replace(item.extension, '')] = item);
      }

      if (
        S(item.path).include(sassFolder) &&
        !(item.name.lastIndexOf(`_`, 0) === 0)
      ) {
        return project.styles.push(item);
      }

      if (
        S(item.path).include(stylusFolder) &&
        !(item.name.lastIndexOf(`_`, 0) === 0)
      ) {
        return project.stylus.push(item);
      }

      if (S(item.path).include(dataFolder) && !item.isDirectory) {
        return project.jsondata.push(item);
      }

      return $log.log(`ignoring ${item.shortPath}`);
    }

    project.files.push(item);
  }

  function processSiteFiles() {
    fse
      .walk(`${root}`, { filter: ignoreFiles })
      .on('data', classifyItems)
      .on('end', () => {
        fs.stat(publicFolder, (err, stats) => {
          if (!err && stats.isDirectory()) {
            copyPublicFiles(publicFolder, dest);
          }
        });

        Render.registerPartials(project.includes);
        Render.registerLayouts(project.layouts);
        processFiles(dest, argv);
      });
  }

  function processThemeFiles() {
    fse
      .walk(path.normalize(themeFolder), { filter: ignoreFiles })
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

/**
 * Creates the resulting html by reading all the pages and parsing with the layouts
 *
 * @param {*} project
 * @returns project
 */
const run = (project) => {
  const promise = new Promise((resolve, reject) => {
    if (
      !project.collected ||
      !project.collected.include ||
      !project.collected.prebuilt
    ) {
      logger.error('Missing prebuilt data at build step');
      return reject();
    }

    return resolve(project);
  });

  return promise;
};

module.exports = {
  run,
};
