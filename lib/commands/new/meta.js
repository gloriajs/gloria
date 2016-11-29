/** @module meta
 *
 * Is an object that holds the information required by the `new` command.
 * Every type of content that can be created will have options like location,
 * extension and whether or not it uses frontmatter
 */

const path = require(`path`);

module.exports = {
    page: { dest: ``, ext: `.html` },
    post: { dest: `_posts${path.sep}`, ext: `.html` },
    partial: { dest: `_includes${path.sep}`, fm: false, ext: `.html` },
    include: { dest: `_includes${path.sep}`, fm: false, ext: `.html` },
    layout: { dest: `_layout${path.sep}`, fm: false, ext: `.html` },
    sass: { dest: `_sass${path.sep}`, fm: false, ext: `.scss` },
    css: { dest: `_public${path.sep}css${path.sep}`, fm: false, ext: `.css` },
    public: { dest: `_public${path.sep}`, fm: false },
};
