#Gloria - static site generator
*gloria is spanish for glory, also the name of my mom and the name was available in npm*

[![Build Status](https://travis-ci.org/dvidsilva/gloria.svg?branch=master)](https://travis-ci.org/dvidsilva/gloria)

This project aims to be a substitute for
[jekyll](https://jekyllrb.com/), to help you
create static websites without depending on ruby.

**WARNING: this is a work in progress** it only has
access to a very limited set of features, and support can be
dropped in any moment.

#Installation

Use [npm](https://www.npmjs.com) to install.

```
npm install -g gloria
```

#Usage

Now gloria is globally installed in your computer, and you can run commands
like `gloria --version` to retrieve the version.

#_CONFIG.yml

The file _config.yml has some important information about your site in
[Yaml](https://learn.getgrav.org/advanced/yaml)format.

Only two values are required, name and location. The default file looks something like this:

```
name: sampleblog
location: sampleblog
layout: default
author: 'david silva'
description: 'Sample site created with gloria'
version: 1.0.0
```
You can add any amount of data here and it will be available for you in the templates
as properties of `site`. Look in the [template](#template) documentation for more info.

#Commands

The following commands are available to use

##Init

`gloria init [name]`

Will create a new project in a specified folder.

Options can be passed in the command like `--name=myBlog` or given in the interactive prompt.

##Build

`gloria build [dest] --clear=false`

Builds the site into the desired destination.
By default it will use a folder name 'site' in the root directory of the project.
It won't build to a parent folder.
The command will fail if _config.yml is invalid or not present.

If clear equals true it will empty the destination directory before processing and copying content to it.

Any amount of key-value pairs can be passed to the build command, like `title='A New Adventure` and they will be
available to use in your templates as properties of `args`.

##Serve

Will spawn a web server to allow access to the built files, using the provided `dest` argument, or the one stored in the
site configuration.

##Help

`gloria --help`

Will provide a list of commands and options available.

#Template

Templates are html or markdown files, they are interpreted with [handlebars](https://www.npmjs.com/package/handlebars).

There are three main objects you can access on your template, `site` has access to the properties specified in `_config.yml`.
`page` has access to the properties specified in the header of the page, and `args` has access to the arguments given to the command
build.

##Layouts

A layout file is used to have a structure common to different pages, for example a navigation menu,
header, css includes, scripts, etc.

The name of the layout will be the name of the file, by default `default.html` is included, additional files
included in the `_layout` folder will be used. If no layout exists or is especified the file will be
rendered on its own.

The main thing that templates require is `{{{page.content}}}` that will get replaced with the actual
content of the page.

##Includes

Include files, or also known as partials, are files that can be included in your content or layouts,
they can be useful to reuse snippets like a `head` element, or a share button.

Any amount of partials and includes can exists, in the `_includes` folder, they are named as their file
name, and they can be used like this `{{> head}}`. Data will be interpolated there as expected.

##Frontmatter

Every page can have additional attributes that will be accessible to it, the layout
or the includes.

The additional attributes should be included in the beginning of the file in the following format, use three dashes
in the first line of the file, and add any key pair of attributes using the
[Yaml](https://learn.getgrav.org/advanced/yaml) syntax, and finish with three dashes. Like this:
```
---
tite: About us
url: /about
description:
---
```

##Issues

There's no layouts or including other files yet.

Roadmap, also includes having access to other pages, to be able to loop in blog posts, or read categories for example.

#Deployment

You can use any service that lets you host HTML or static sites. The quickest ones to get working
are [github pages](https://pages.github.com/) and
[firebase](https://firebase.google.com/docs/hosting/).

## Firebase instructions

Create a firebase account and a project, then run `firebase init` on your root folder and follow the instructions.
When prompted what folder to use, chose your destination folder.

## Github pages instructions

The best option to use github pages is to build your site to a folder called `docs`, push to a repo, and then select
that folder in the github-pages configuration for that repo.

#Development and contributing

Refer to our [Contributing page](CONTRIBUTING.md)

#Troubleshooting

We're currently using:

```
node v6.4.0
npm 3.10.3
```

Try upgrading your version of node and run `yarn` again. Or open
an [issue](https://github.com/gloriajs/gloria/issues) describing your problem.
