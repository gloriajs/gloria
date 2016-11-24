#0.9.0
## Added the option to include posts

Posts can be included in a folder _posts, they will be rendered using the
layout `post.html`.

There's a property named posts, that can be used to get a lists of posts
to lists them.

The bootstrap layout, includes examples on how to use them.

@todo:
     - Prevent errors when templates don't exists.
     - Create helpers to allow nesting layout/template
     - Create new command

#0.8.3

Fixed typo in package.json

#0.8.2

Replaced the markdown engine with [marked](https://github.com/chjj/marked).

#0.8.1

Simple bug fixes

#0.8.0
**Simple support for sass**

Using node-sass, it will look for main.scss files in a _sass folder.
It will then output the compiled files into {dest}/sass/

@todo: allow to customize the source and destination of sass files.

#0.7.0
**Added a migrate command**

Allows to migrate a jekyll site to gloria. Poorly,
as described [here](https://github.com/gloriajs/gloria/issues/15).
