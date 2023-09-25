const hbs = require("handlebars");
const logger = require('../utils/logger');

const createFilter = (conditions, context, options) => {
  let s = '';
  const [filter_key, filter_value] = conditions;

  const filtered = context.reverse().filter((a) => {
    return a.item.attrs[filter_key] === filter_value;
  });

  filtered.forEach((item) => {
    s += options.fn(item);
  });

  return s;
};

/**
 * @param {array} items the pages attribute after the prebuild step
 *
 * @returns {string} a list of blog posts in creation order html with the interpolated block
 */
hbs.registerHelper('blog_posts', (context, options) => {
  return createFilter(['type', 'post'], context, options);
});

/**
 * @param {array} items the pages attribute after the prebuild step
 *
 * @returns {string} a list of blog posts in creation order html with the interpolated block
 */
hbs.registerHelper('pages_in_nav', (context, options) => {
  return createFilter(['nav', true], context, options);
});

module.exports = hbs;
