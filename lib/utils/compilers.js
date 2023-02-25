const path = require('path');
const marked = require('marked');
const Handlebars = require("handlebars");
const logger = require('./logger');

/**
 * Reads from the available information and generates a string where the file goes
 * @param {*} item
 * @param {string} item.destination.path
 * @param {string} item.destination.file
 * @returns {string} destination to write content to
 */
const calculateDestination = (item) => {
  const { destination } = item;

  if (!destination.path && !destination.file) {
    return '';
  }

  if (!destination.path) {
    return '' + destination.file;
  }

  if (typeof destination.path !== 'string') {
    return '';
  }

  if (
    typeof destination.path === 'string' &&
    typeof destination.file === 'string'
  ) {
    return `${destination.path}/${destination.file}`;
  }

  if (item.shortPath.endsWith('CNAME')) {
    return 'CNAME';
  }

  return 'index.html';
};

/**
 * Find layout file from collected ones, and parse html to interpolate the current file into it
 * @param {*} item
 * @param {*} files
 * @returns html string
 */
const getLayoutHTML = (item, files) => {
  let html = '{{{content}}}';

  if (!item.attrs.layout) {
    return html;
  }

  const layout_file = files.find(
    (file) => file.item.attrs.name === item.attrs.layout,
  );

  if (layout_file) {
    html = marked.parse(layout_file.item.content);
  }

  return html;
};

/**
 * Interpolates the content of the paage and available data into the layout and returns the full content of the page
 * @param {*} layout
 * @param {*} item
 * @param {*} data
 * @returns html string
 */
const interpolateLayoutAndContent = (layout, item, data) => {
  // currently no support for nested layouts
  const html = marked.parse(item.content);
  // compile template using site data and content of page
  const layout_template = Handlebars.compile(layout);
  const layout_with_html = layout_template({ ...data, content: html });

  // replace variables with values (handlebars) in full content
  const template = Handlebars.compile(layout_with_html);
  const result = template({ ...data });

  return result;
};

/**
 * Has a dictionary with keys as the file extensions and methods that process the content
 * of the file to create the pages, currently supporting markdown.
 * CSS due to tailwind, is processed globally after passing thru all the items
 *
 * @param item {object}
 */
const compilers = (item) => {
  const ext = path.extname(item.shortPath);

  const noop = (item) => {
    return {
      dest: calculateDestination(item),
      content: item.content || '',
    };
  };

  const options = {
    '.md': function (item, files, data) {
      // get html from layout
      const layout = getLayoutHTML(item, files);
      // compile md to html and include in layout
      const result = interpolateLayoutAndContent(layout, item, data);
      logger.info(`Compiled: ${item.shortPath}`);

      return {
        dest: calculateDestination(item),
        content: result,
      };
    },
    '.html': function (item, files, data) {
      // get html from layout
      const layout = getLayoutHTML(item, files);
      // compile md to html and include in layout
      const result = interpolateLayoutAndContent(layout, item, data);
      logger.info(`Compiled: ${item.shortPath}`);

      return {
        dest: calculateDestination(item),
        content: result,
      };
    },
  };

  if (options[ext]) {
    return options[ext];
  }
  console.log(`${item.shortPath} has no associated compiler`);

  return noop;
};

module.exports = {
  compilers,
};
