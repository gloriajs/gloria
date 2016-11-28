const fse = require('fs-extra');

//@todo: let the user select their preferred template engine
const Handlebars = require('handlebars');
var marked = require('marked');
const fm = require('front-matter');
const S = require(`string`);

const sass = require(`node-sass`);
const root = process.cwd();
const Render = {};
Render.layouts = {};
Render.partials = {};

Handlebars.registerHelper('replace', (options) => '');
Handlebars.registerHelper('noop', (options) => options.fn(this));
Handlebars.registerHelper('for', (options) => console.log(options));

const registerLayouts = function (files) {
    for (var k in files) {
        if (files[k].name.match('.html') === null) {
            return;
        }

        files[k].content = fse.readFileSync(files[k].path, `utf-8`);
        Render.layouts[k] = files[k];
    }

    return Render.layouts;
};

const registerPartials = function (files) {
    files.forEach((file) => {
        if ([`.html`, `.svg`, `.md`].indexOf(file.extension) === -1) {
            return;
        }

        let partial = Object.assign({}, file, {
            content: fse.readFileSync(file.path, `utf-8`),
            name: file.name.replace('.html', ''),
        });
        Render.partials[partial.name] = partial;

        Handlebars.registerPartial(partial.name, partial.content);
        Handlebars.registerPartial(file.name, partial.content);

    });

    return files;
};

const renderCommon = function (page, content, data) {
    let template = Handlebars.compile(content);
    let result = template(data);
    let newname = (page.name || ``).replace(/\.md$/, '.html');
    let destination = {
        folder: page.basePath,
        file: newname,
    };
    if (newname !== 'index.html') {
        destination.folder = `${page.basePath}${page.name.replace('.html', '')}`;
        destination.file = `index.html`;
    }

    if (data.page.url) {
        destination.folder = `${page.basePath}${data.page.url}/`;
        page.name = 'index.html';
    }

    data.page.content = result;
    let layoutName = page.data.layout || `default`;
    if (Render.layouts[layoutName]) {
        template = Handlebars.compile(Render.layouts[layoutName].content);
        result = template(data);
    }

    return {
        destination: destination,
        content: result,
    };
};

const extract = function (file) {
    let content = ``;
    try {
        content = fse.readFileSync(file.path, `utf-8`);
    } catch (err) {
        if (err) throw err;
    }

    content = fm(content);
    let destination = {
        folder: file.basePath,
        file: file.name,
    };

    return {
        destination: destination,
        content: content.body,
        fm: content.attributes,
    };
};

const renderStyles = function (item, dest) {
    let result = extract(item);
    console.log(`${root}/${item.basePath}`);
    result.css = sass.renderSync({
        data: result.content,
        includePaths: [`${root}/${item.basePath}`],
    });
    return result;
};

const renderHtml = function (page, data) {
    data.page = page.data;
    return renderCommon(page, page.content, data);
};

const renderMD = function (page, data) {
    data.page = page.data;
    let html = marked(page.content);
    return renderCommon(page, html, data);
};

const renderPost = function (page, data) {
    let result = {};
    let html = marked(page.content);
    data.page = page.data;
    data.page.url = page.data.url;
    result = renderCommon(page, html, data);
    result.destination.folder = `${page.data.url}/`;
    return result;
};

Render['.html'] = renderHtml;
Render['.md'] = renderMD;
Render.post = renderPost;
Render.extract = extract;
Render.registerPartials = registerPartials;
Render.registerLayouts = registerLayouts;
Render.renderStyles = renderStyles;

module.exports = Render;
