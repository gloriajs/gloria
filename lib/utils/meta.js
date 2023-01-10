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
        fm,
    };

    const data = fm(content);

    /** Good place to extract tags, categories and other things, so they can be classified later */
    return ({
        ...attrs,
        fm: data,
        url: data.attributes.permalink,
    });
};

module.exports = {
    read,
};
