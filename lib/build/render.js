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

    return renderCommon(file, content.body, data);
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

    return renderCommon(file, html, data);
}

function renderCommon(file, content, data) {
    let template = Handlebars.compile(content);
    let result = template(data);
    let newname = file.name.replace(/\.md$/, '.html');
    let destination = {
        folder: file.basePath,
        file: newname,
    };
    if (newname !== 'index.html') {
        destination.folder = `${file.basePath}${file.name.replace('.html', '')}`;
        destination.file = `index.html`;
    }

    if (data.page.url) {
        destination.folder = `${file.basePath}${data.page.url}/`;
        file.name = 'index.html';
    }

    return {
        destination: destination,
        content: result,
        fm: data.page,
    };
}

module.exports = Render;
