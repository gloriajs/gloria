const Handlebars = require('handlebars');
const fse = require('fs-extra');

Handlebars.registerHelper('replace', (options) => '');
Handlebars.registerHelper('noop', (options) => options.fn(this));
Handlebars.registerHelper('for', (options) => console.log(options));

Handlebars.registerHelper('capitalize', function (value) {
    return (value && typeof value === 'string') ? value.replace(/\b\w/g, l => l.toUpperCase()) : '';
});

Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a === b) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
    if (a === b) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerPartials = function registerPartials (files) {
    const partials = {};
    files.forEach((file) => {
        if ([ `.html`, `.svg`, `.md` ].indexOf(file.extension) === -1) {
            return;
        }

        const partial = Object.assign({}, file, {
            content: fse.readFileSync(file.path, `utf-8`),
            name: file.name.replace('.html', ''),
        });
        partials[partial.name] = partial;

        Handlebars.registerPartial(partial.name, partial.content);
        Handlebars.registerPartial(file.name, partial.content);

    });

    return partials;
};

module.exports = Handlebars;
