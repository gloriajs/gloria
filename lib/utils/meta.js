const fm = require('front-matter');

/**
 * Returns the front matter metadata included in the file's content
 *
 * @param {string} content string with the file content to read front matter attributes
 *
 * @returns {object} that has placeholders for all the attributes combined with the extracted ones
 */
const read = (content) => {
  const attrs = {
    links_from: [],
    links_to: [],
    title: '',
    name: '',
    layout: '',
    description: '',
    tags: [],
    category: '',
    url: '',
    raw: {},
  };

  const data = fm(content);

  /** @TODO: Good place to extract tags, categories and other things, so they can be classified later */
  return {
    ...attrs,
    ...data.attributes,
    raw: data,
    url: data.attributes.permalink,
  };
};

module.exports = {
  read,
};
