const $q = require(`q`);
const fs = require(`../utils/fs`);
const S = require(`string`);
const prompt = require(`prompt-sync`)();
const chalk = require('chalk');
const Project = require('../core/project');
const version = require('../version');
const path = require(`path`);

const optionsBuilder = function (argv) {
    const layoutsDir = __dirname.split(`${path.sep}`).slice(0, 7)
        .concat('layouts').join(`${path.sep}`);
    if (!fs.existsSync(`${layoutsDir}${path.sep}${argv.layout}`)) {
        console.log(`${argv.layout} doesn't exist, setting layout to default.`);
        argv.layout = 'bootstrap';
    }

    return {
        name: S(argv.name).slugify().s,
        location: `${S(argv.name).slugify().s}`,
        longname: S(argv.name).humanize().s,
        layout: argv.layout || `bootstrap`,
        author: '',
    };
};

const inputNameAndLocation = function (argv, project, options) {
    if (argv.interactive) {
        project.config.name = options.name ||
          prompt(`Enter short name for the blog: `, options.name);
        project.config.location = options.location ||
          prompt(`Enter a folder name if different from [${options.name}]:`, options.location);
        project.config.location = options.location ? options.location :
          `${S(options.name).slugify().s}`;
    }

    if (!project.config.name || !project.config.location) {
        console.warn(chalk.red(`A name and location are required`));
        return false;
    }

    return true;
};

const inputRest = function (argv, project, options) {

    if (argv.interactive) {
        project.config.author = options.author || prompt(`Author name:`);
        project.config.longname = options.longname ||
            prompt(`Enter the longname to use in your site's title: [${options.name}]`,
                options.name);
        project.config.description = options.description ||
            prompt(`Enter the description to use in your site:`);
    }

    project.config.version = version;
    return true;
};

const showSiteInfo = function (project) {

    console.log(`\n${chalk.bold.cyan('Site will be created with the following information')}`);
    console.log(project.getConfig('yaml'));

};

const confirmSite = function (argv) {
    let confirm = 'Y';
    if (argv.interactive) {
        confirm = prompt(`Looks good?: [Yn]`, `Y`);
    }

    if (!(confirm === `y` || confirm === `Y`)) {
        return false;
    } else {
        return true;
    }
};

const fileLocationNotAvailable = function (argv, options) {
    const location = `${process.cwd()}${path.sep}${options.location}`;
    if (fs.existsSync(`${location}${path.sep}_config.yml`) && argv.force !== true) {
        confirm = prompt(chalk.bgRed(`It looks like a site already
             exists on that folder,
            do you want to overwrite?: [yN]`), `N`);
        if (confirm !== `y` && confirm !== `Y`) {
            console.log(chalk.green(`Aborting!`));
            return true;
        } else {
            return false;
        }
    }
};

const createSite = function (project) {
    project.create({ force: true }).then(() => {
        console.log(chalk.green(`Saved!
                cd into the directory '${project.config.location}' and run
                'gloria serve' to get started.`));

    }, (err) => {
        console.log(chalk.red(`Error creating project!`), err);
    });
};

const handler = function (argv) {

    const options = optionsBuilder(argv);
    const project = new Project(options);
    console.log(`Creating new gloria site.\n` +
        (options.name ? `named: ${options.name}, in folder: .${path.sep}${options.name}` : ``));
    console.log(`Please complete the following information to continue:`);

    if (!inputNameAndLocation(argv, project, options)) {
        return;
    }

    inputRest(argv, project, options);
    showSiteInfo(project);
    if (!confirmSite(argv)) {

        return;
    }

    if (fileLocationNotAvailable(argv, options)) {
        return;
    }

    createSite(project);

};

const builder = {
    name: {
        default: ``,
        description: `Short name to use in the site's configuration, folder name`,
    },
    longname: {
        default: ``,
        description: `A longer name to use in your site's content`,
    },
    description: {
        default: ``,
        description: `Set a description for your site`,
    },
    location: {
        default: ``,
        description: `Folder where your files and site will be at`,
    },
    layout: {
        default: `bootstrap`,
        description: `There are two layouts currently available:
            Bootstrap, includes bootstrap css files with several themes form bootswatch
            Default, is basically an empty layout.`,
    },
    interactive: {
        default: true,
        description: `Use the interactive prompt to complete the details`,
    },
    force: {
        default: false,
        description: `If files exists, overwrite them?`,
    },
};

module.exports = {
    command: `init [name]`,
    aliases: [`create`],
    describe: `Initializes a new site, interactively or using the given parameters.
    It will create a base configuration file and sample pages using the desired layout.`,
    builder: builder,
    handler: handler,
    optionsBuilder: optionsBuilder,
    showSiteInfo: showSiteInfo,
    confirmSite: confirmSite,
    inputNameAndLocation: inputNameAndLocation,
    inputRest: inputRest,
    fileLocationNotAvailable: fileLocationNotAvailable,
    createSite: createSite,
};
