# Next Version

# 0.16.0

- Adds a timestamp property to pages data
- Created a method eachWithSort for a handlebar helper

# 0.15.1

- Added formatDate helper to handlebars helpers

# 0.15.0

- adding filename to the data available for page
- Use frontmatter to customize layouts and includes (Issue #13)

# 0.14.0

- Not clearing destination folder by default when serving

#0.13.0

- Reading files from the theme folder and including them in the build process
- Allowing users to have different themes, and include the correct files from the theme selected
- Fixed bug occuring to windows users when building/serving #97

#0.12.0

- Using an utils file for logger
- Using config store to save configuration information for the module
- Suggesting users to download the latest version if available

#0.11.0

- Removed unused dependencies
- Added code of conduct
- Replaced jscs with eslint

#0.10.0

- Fixed bug that prevent init from working on windows
- Added build stats
- Watches files and builds during serve
- Allows to add additional data as json files, in the _data folder.
  The data can be used in the templates as {{data.'jsonFileName'}}

#0.9.6

- Fix issue #59, every post has a correct url, even when it has categories

#0.9.5

- Performance improvements in the build command
- Fixed bugs with prompts
- Increased test coverage
- Allows to chose a layout from the provided ones
- Added support for _stylus files
- Added a `watch` flag for serve command

#0.9.4

- Added the `new` command to make it easier adding new content

#0.9.3
- Refactored the render file, for the build command

#0.9.2

- Added performance fixes

#0.9.1
#0.9.0
## Added the option to include posts

- Posts can be included in a folder _posts, they will be rendered using the
layout `post.html`.

- There's a property named posts, that can be used to get a lists of posts
to lists them.

- The bootstrap layout, includes examples on how to use them.

**@todo**:
     - Prevent errors when templates don't exists.
     - Create helpers to allow nesting layout/template
     - Create new command

#0.8.3

- Fixed typo in package.json

#0.8.2

- Replaced the markdown engine with [marked](https://github.com/chjj/marked).

#0.8.1

- Simple bug fixes

#0.8.0
**Simple support for sass**

- Using node-sass, it will look for main.scss files in a _sass folder.
It will then output the compiled files into {dest}/sass/

**@todo**: allow to customize the source and destination of sass files.

#0.7.0
**Added a migrate command**

- Allows to migrate a jekyll site to gloria. Poorly,
as described [here](https://github.com/gloriajs/gloria/issues/15).
