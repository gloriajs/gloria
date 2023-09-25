const path = require('path');
const marked = require('marked');
const hbs = require('./handlebars');
const logger = require('./logger');

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
 * @param {[]} files
 * @returns html string
 */
const interpolateLayoutAndContent = (layout, item, data, files) => {
  // currently no support for nested layouts
  const html = marked.parse(item.content);
  // compile template using site data and content of page
  const layout_template = hbs.compile(layout);
  const layout_with_html = layout_template({ ...data, content: html, files });

  // replace variables with values (handlebars) in full content
  const template = hbs.compile(layout_with_html);
  const result = template({ ...data, files });

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

  const noop = (file) => {
    const { item, destination } = file;
    return {
      destination,
      content: item.content || '',
    };
  };

  const options = {
    '.md': function (file, files, data) {
      const { item, destination } = file;
      // get html from layout
      const layout = getLayoutHTML(item, files);
      // compile md to html and include in layout
      const result = interpolateLayoutAndContent(layout, item, data, files);
      logger.info(`Compiled: ${item.shortPath}`);

      return {
        destination,
        content: result,
      };
    },
    '.html': function (file, files, data) {
      const { item, destination } = file;
      // get html from layout
      const layout = getLayoutHTML(item, files);
      // compile md to html and include in layout
      const result = interpolateLayoutAndContent(layout, item, data, files);
      logger.info(`Compiled: ${item.shortPath}`);

      return {
        destination,
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
