var path = require('path');

/**
 * Has a dictionary with keys as the file extensions and methods that process the content
 * of the file to create the pages, currently supporting markdown.
 * CSS due to tailwind, is processed globally after passing thru all the items
 *
 * @param item {object}
 */
const compilers = (item) => {
    const ext = path.extname(item.shortPath);

    const noop = (item, items) => {
        return '';
    };

    const options = {
        '.md': function (item, items) {
            return ('compiled', item.shortPath);
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
