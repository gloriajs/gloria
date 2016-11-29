/** @module new */

const S = require('string');
const chalk = require('chalk');
const path = require('path');

// the object meta holds information about the different types that can be
// created, like it's location, template and whether or not it uses frontmatter

const meta = require('./new/meta');
const fs = require('../utils/fs');
const createContent = require(`./new/create-content`);

/** @function
 * @name handler
 *
 * @param argv Command line arguments, pased to this function by the argv package
 */
function handler(argv) {
    let options = argv;
    let file;

    options.name = S(options.name || options.title).dasherize().s;
    if (!meta[options.type]) {
        return console.error(chalk.red(`Invalid type provided, please use one of:
        post|page|layout|partial|sass|css|public`));
    }

    Object.assign(options, meta[options.type]);
    options.ext = path.extname(options.name) ? path.extname(options.name) : options.ext;
    options.fullPath = `./${(options.folder + '/')}${options.dest}${options.name}${options.ext}`;
    file = createContent(options);

    fs.ensureDir(path.dirname(options.fullPath)).then(function () {
        if (argv.verbose) {
            console.log(chalk.green(`Folder ${path.dirname(options.fullPath)} verified.`));
        }

        return fs.writeFile(options.fullPath, file.content);
    }).then(function (data, err) {
        if (argv.verbose) {
            console.log(chalk.green(`File ${options.fullPath} created.`));
        }

    });

}

const builder = {
    type: {
        default: `post`,
        description: `Type of content to create.
            post|page|layout|partial|sass|css|public are available.`,
    },
    title: {
        default: '',
        description: 'Title for the page or content.',
    },
    name: {
        default: '',
        description: 'Name for the file, if none is provided, title will be used.',
    },
    description: {
        default: '',
        description: 'Description for the page or content.',
    },
    category: {
        default: '',
        description: 'Category, usually included in posts.',
    },
    verbose: {
        default: true,
        description: `Supress logs and warnings`,
    },
    folder: {
        default: '',
        description: `Can be used to prepend to the directory where the file is created.`,
        type: 'path',
    },
};

module.exports = {
    command: `new [type] [title]`,
    aliases: [`n`],
    describe: `Creates new content, with different templates, depending on the type.
    Examples: 
        gloria new post hello-world
        gloria new --type=page --title='Contact Us' --description='Contact form.' `,
    builder: builder,
    handler: handler,
};
