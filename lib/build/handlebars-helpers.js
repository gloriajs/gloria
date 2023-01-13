const $log = require('../utils/logger');
const Handlebars = require('handlebars');
const fse = require('fs-extra');
const moment = require('moment');

Handlebars.registerHelper('replace', (options) => '');
Handlebars.registerHelper('noop', (options) => options.fn(this));
Handlebars.registerHelper('for', (options) => $log.log(options));

Handlebars.registerHelper('capitalize', function (value) {
  return value && typeof value === 'string'
    ? value.replace(/\b\w/g, (l) => l.toUpperCase())
    : '';
});

Handlebars.registerHelper('eachWithSort', (array, key, direction, opts) => {
  let data;
  if (opts.data) {
    data = Handlebars.createFrame(opts.data);
  }

  const sorted = array.sort((a, b) => {
    a = a[key];
    b = b[key];
    if (direction === '-') {
      return a < b ? 1 : a == b ? 0 : -1;
    } else {
      return a > b ? 1 : a == b ? 0 : -1;
    }
  });

  let s = '';
  sorted.forEach((e, i) => {
    if (data) {
      data.index = i;
    }

    s += opts.fn(e, data);
  });

  return s;
});

Handlebars.registerHelper('formatDate', function (value, format) {
  format = format || 'MMM Do YY';
  return moment.utc(value).format(format);
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

Handlebars.registerPartials = function registerPartials(files) {
  const partials = {};
  files.forEach((file) => {
    if ([`.html`, `.svg`, `.md`].indexOf(file.extension) === -1) {
      return;
    }

    // calling require here to avoid circular dependencies
    // http://selfcontained.us/2012/05/08/node-js-circular-dependencies/
    const Render = require('./render');
    const fm = Render.extract(file);
    const partial = Object.assign({}, file, {
      content: fm.content,
      variables: fm.fm,
      name: file.name.replace('.html', ''),
    });
    partials[partial.name] = partial;

    Handlebars.registerPartial(partial.name, partial.content);
    Handlebars.registerPartial(file.name, partial.content);
  });

  return partials;
};

module.exports = Handlebars;
