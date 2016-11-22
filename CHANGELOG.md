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
as described [here](https://github.com/dvidsilva/gloria/issues/15).