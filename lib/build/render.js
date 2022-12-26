const fse = require('fs-extra');
const stylus = require('stylus');
const marked = require('marked');
const fm = require('front-matter');
const S = require(`string`);

// const sass = require(`node-sass`);
const path = require(`path`);
const $log = require('../utils/logger');
const moment = require('moment');

//@todo: let the user select their preferred template engine
const Handlebars = require('./handlebars-helpers');
const root = process.cwd();
const Render = {};
Render.layouts = {};
Render.partials = {};

const registerLayouts = function (files) {
    for (var k in files) {
        if (files[k].name.match('.html') === null) {
            return;
        }

        var layoutFrontMatter = extract(files[k]);
        Object.assign(files[k], layoutFrontMatter);
        Render.layouts[k] = files[k];
    }

    return Render.layouts;
};

const registerPartials = function (files) {
    Render.partials = Handlebars.registerPartials(files);
};

const renderCommon = function (page, content, data) {
    let template;
    try {
        template = Handlebars.compile(content);
    } catch (e) {
        $log.warn(`failed to compile template ${template}`);
    }

    let result = template(data);
    const newname = (page.name || ``).replace(/\.md$/, '.html');
    const destination = {
        folder: page.basePath,
        file: newname,
    };
    if (newname !== 'index.html') {
        destination.folder = `${page.basePath}${page.name.replace('.html', '')}`;
        destination.file = `index.html`;
    }

    if (data.page.url) {
        const folder = data.page.url;
        destination.folder = `${folder}`;
        page.name = 'index.html';
    } else {
        const folder = data.page.title ?
             `blog/${S(data.page.category).slugify().s}/${S(data.page.title).slugify().s}` :
             page.name.replace('.html', '');
        destination.folder = `${folder}`;
        page.name = 'index.html';
    }
    data.page.content = result;
    const layoutName = page.data.layout || `default`;
    if (Render.layouts[layoutName]) {

        // g is a namespace for layout and hbs partials' vars
        data.page.g = {};
        data.page.g.layout = Render.layouts[layoutName].fm;
        Object.assign(data.page.g, extractPartialsVariables(Render.layouts[layoutName].content));
        try {
            template = Handlebars.compile(Render.layouts[layoutName].content);
        } catch (e) {
            $log.warn(`Failed to compile file ${template}`);
        }
        result = template(data);
    }

    return {
        destination: destination,
        content: result,
        data: data,
    };
};

const extract = function (file) {
    let content = ``;
    try {
        content = fse.readFileSync(file.path, `utf-8`);
    } catch (err) {
        if (err) {throw err;}
    }

    content = fm(content);
    const timestamp = moment.utc(content.date ? content.date : file.stats.birthtime).format('X');

    const destination = {
        folder: file.basePath,
        file: file.name,
    };

    return {
        destination: destination,
        content: content.body,
        fm: Object.assign({timestamp}, content.attributes),
    };
};

const renderStyles = function (item, dest) {
    $log.log(`ignoring sass file: ${item.basePath}${item.name}`);
    const result = extract(item);
    result.css = '';

    // sass.renderSync({
    //     data: result.content,
    //     includePaths: [ `${root}/${item.basePath}` ],
    // });
    return result;
};

const renderStylus = function (item, dest) {
    $log.log(`rendering stylus file: ${item.basePath}${item.name}`);
    const result = extract(item);
    result.css = stylus(result.content)
    .set('paths', [ `${root}/${item.basePath}` ])
    .render();
    return result;
};

const renderHtml = function (page, data) {
    data.page = page.data;
    return renderCommon(page, page.content, data);
};

const renderMD = function (page, data) {
    data.page = page.data;
    const html = marked(page.content);
    return renderCommon(page, html, data);
};

const renderPost = function (page, data) {
    let result = {};
    const html = marked(page.content);
    data.page = page.data;
    data.page.url = page.data.url;
    result = renderCommon(page, html, data);
    result.destination.folder = path.normalize(`${result.destination.folder}`);
    return result;
};

const extractPartialsVariables = function (document) {
    var regex = /{{>([\s\w]+)}}/g;
    var partialsVars = {};
    while ((result = regex.exec(document)) !== null) {
        var partialName = (result[1].trim());
        var currrentPartial = Render.partials[partialName];
        if (currrentPartial) {
            partialsVars[partialName] = currrentPartial.variables;
        }
    }

    return partialsVars;
};

Render['.html'] = renderHtml;
Render['.md'] = renderMD;
Render.post = renderPost;
Render.extract = extract;
Render.registerPartials = registerPartials;
Render.registerLayouts = registerLayouts;
Render.renderStyles = renderStyles;
Render.renderStylus = renderStylus;

module.exports = Render;
