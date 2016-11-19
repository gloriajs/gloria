const $q = require(`q`);
const fs = require(`../utils/fs`);
const S = require(`string`);
const prompt = require(`prompt-sync`)();
const chalk = require('chalk');
const Project = require('../core/project');
const version = require('../version');

function handler(argv) {
    const options = {
        name: S(argv.name).slugify().s,
        location: `${S(argv.name).slugify().s}`,
        longname: S(argv.name).humanize().s,
        layout: `bootstrap`,
        author: '',
    };
    const project = new Project(options);
    console.log(`Creating new gloria site.\n` +
        (options.name ? `named: ${options.name}, in folder: ./${options.name}` : ``));
    console.log(`Please complete the following information to continue:`);

    if (argv.interactive) {
        project.config.name = options.name ||
            prompt(`Enter short name for the blog: [${options.name}]`, options.name);
        project.config.location = options.location ||
            prompt(`Enter the folder on which you want to create the site if 
            different to the name,[${options.location}]`, options.location);
        project.config.location = options.location ? options.location :
            `${S(options.name).slugify().s}`;
    }

    if (!project.config.name || !project.config.location) {
        console.warn(chalk.red(`A name and location are required`));
        return;
    }

    if (argv.interactive) {
        project.config.author = options.autor || prompt(`Author name:`);
        project.config.longname = options.longname ||
            prompt(`Enter the longname to use in your site's title: [${options.name}]`,
            options.name);
        project.config.description = options.description ||
            prompt(`Enter the description to use in your site:`);
    }

    project.config.version = version;

    console.log(`\n${chalk.bold.cyan('Site will be created with the following information')}`);
    console.log(project.getConfig('yaml'));
    let confirm = 'Y';
    if (argv.interactive) {
        confirm = prompt(`Looks good?: [Yn]`, `Y`);
    }

    if (confirm === `y` || confirm === `Y`) {
        const location = `${process.cwd()}/${options.location}`;
        if (fs.existsSync(`${location}/_config.yml`) && argv.force !== true) {
            confirm = prompt(chalk.bgRed(`It looks like a site already exists on that folder,
                do you want to overwrite?: [yN]`), `N`);
            if (confirm !== `y` && confirm !== `Y`) {
                console.log(chalk.green(`Aborting!`));
                return;
            }

        }

        project.create({ force: true }).then(function () {
            console.log(chalk.green(`Saved!
                 cd into the directory '${project.config.location}' and run 
                 'gloria serve' to get started.`));
        }, function (err) {
            console.log(chalk.red(`Error creating project!`), err);

        });

    }
}

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
    }
};

module.exports = {
    command: `init [name]`,
    aliases: [`new`, `create`],
    describe: `Initializes a new site, interactively or using the given parameters.
    It will create a base configuration file and sample pages using the desired layout.`,
    builder: builder,
    handler: handler,
};
