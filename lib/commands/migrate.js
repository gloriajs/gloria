const chalk = require(`chalk`);
const fse = require(`fs-extra`);
const S = require(`string`);
const path = require(`path`);
const fs = require(`../utils/fs`);

const Project = require('../core/project');
const project = new Project;

const root = process.cwd();

function handler (argv) {
    if (argv.source !== 'jekyll') {
        return console.warn(chalk.red(`Sorry, only jekyll is supported now`));
    }

    let dest = project.config.dest || argv.dest;
    project.loadConfigFromYamlFile();
    project.change({
        dest: dest,
        longname: project.config.title,
    });
    project.saveYAML(true, root);
    dest = `${root}/${dest}`;

    if ((argv.exporto).lastIndexOf(`..`, 0) === 0) {
        console.log(`Copying files to destination folder ${root}/${argv.exporto}`);
        fse.copySync(root, dest);
    }

    fse.walk(`${root}`).on('data', (item) => {
        if (S(item.path).include(dest)) {return;}

        item.isDirectory = item.stats.isDirectory();
        item.shortPath = S(item.path).chompLeft(root).s;
        item.name = path.basename(item.path);
        item.basePath = S(item.shortPath).chompRight(item.name).s;
        item.extension = path.extname(item.path);
        if ((item.shortPath.lastIndexOf(`/.git`, 0) === 0) && item.name !== `.gitignore`) {
            return;
        }

        if (item.shortPath.lastIndexOf(`/_site`, 0) === 0) {
            return;
        }

        if ([ `.html`, `.md` ].indexOf(item.extension) !== -1) {
            console.log(`migrating file`, item.path);
            let content = fse.readFileSync(item.path, `utf-8`);

            // content = convert('{liquid}')
            content = content.replace(/{%\s*include/g, `{{>`);
            content = content.replace(/{%\s*if/g, `{{#if`);
            content = content.replace(/{%\s*else/g, `{{^`);
            content = content.replace(/{%\s*endif/g, `{{/if`);
            content = content.replace(/^permalink:/, `url:`);
            content = content.replace(/\|.+}}/g, `}}`);
            content = content.replace(/{%/g, `{{`);
            content = content.replace(/%}/g, `}}`);
            try {
                fs.writeFileSync(item.path, content);
            } catch (err) {
                throw err;
            }

            console.log(`Migrated file `, item.path);
        }

    });
}

const builder = {
    source: {
        default: `jekyll`,
        description: `Source platform.`,
    },
    exporto: {
        default: false,
        description: `When specified, the folder where the new files will be exported`,
    },
    dest: {
        default: 'docs',
    },
};

module.exports = {
    command: `migrate [source]`,
    aliases: [],
    describe: `Migrates an existing website from a different platform to gloria.
    I'ts pretty buggy now and only works with jekyll.
    The replacement is pretty poor right now, it uses regex to find some liquid tags
    and replaces them with handlebars. It ignores some helpers like loops.
    It requires some extra manual work. If that's not cool with you, please consider a PR.`,
    builder: builder,
    handler: handler,
};
