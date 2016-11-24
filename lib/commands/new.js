/** @module new */

/** @function
 * @name handler
 *
 * @param argv Command line arguments, pased to this function by the argv package
 */
function handler(argv) {
}

const builder = {
    post: {
        default: `post`,
        description: `Type of content to create, only post|page are available now.`,
    },
    dest: {
        default: '_posts',
    },
};

module.exports = {
    command: `new [type] [title]`,
    aliases: [],
    describe: `Creates a new page or post using the specified template.`,
    builder: builder,
    handler: handler,
};
