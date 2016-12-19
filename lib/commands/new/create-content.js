/** @module new/createContent
 *
 * It has the methods necesary to build content for the new command,
 * it uses the options and templates pre-defined to create the file.
 * It will return the string that will be the content of the file.
 */

const YAML = require('yamljs');

const buildHeaders = function buildHeaders (options) {
    return {
        title: options.title || '',
        description: options.description || '',
        type: options.type || '',
        layout: options.layout || '',
        category: options.category || '',
        url: (options.category || '') + options.name,
    };
};

module.exports = function createContent (options) {
    let headers;
    let content = ``;
    const body = ``;
    if (options.fm !== false) {
        headers = buildHeaders(options);
        content = `---\n${YAML.stringify(headers)}\n---`;
    }

    return {
        headers: headers,
        body: body,
        content: content,
    };
};
