const fse = require('fs-extra');

//@todo: let the user select their preferred template engine
const Handlebars = require('handlebars');
var markdown = require('markdown').markdown;
const fm = require('front-matter');

const Render = {};

Render['.html'] = renderHtml;
Render['.md'] = renderMD;

function renderHtml(file, data) {
    let content = ``;
    try {
        content = fse.readFileSync(file.path, `utf-8`);
    } catch (err) {
        if (err) throw err;
    }

    content = fm(content);
    data.page = content.attributes;
    let template = Handlebars.compile(content.body);
    let result = template(data);
    let destination = {
        folder: file.basePath,
        file: file.name,
    };
    if (file.name !== 'index.html') {
        destination.folder = `${file.basePath}${file.name.replace('.html', '')}`;
    }

    return {
        destination: destination,
        content: result,
    };
}

function renderMD(file, data) {
    let content = ``;
    try {
        content = fse.readFileSync(file.path, `utf-8`);
    } catch (err) {
        if (err) throw err;
    }

    content = fm(content);
    data.page = content.attributes;
    let html = markdown.toHTML(content.body);
    let template = Handlebars.compile(html);
    let result = template(data);
    let newname = file.name.replace(/\.md$/, '.html');
    let destination = {
        folder: file.basePath,
        file: newname,
    };
    if (newname !== 'index.html') {
        destination.folder = `${file.basePath}${file.name.replace('.html', '')}`;
    }

    return {
        destination: destination,
        content: result,
        fm: content.attributes,
    };
}

module.exports = Render;
