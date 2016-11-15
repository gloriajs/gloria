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

##Help

`gloria --help`

Will provide a list of commands and options available.


#Development and contributing

Fork and clone the repo. Then run `yarn` to install the
dependencies.

Run `npm link` inside the repo to use your local Development
version instead of the globally installed one.

Add changes, commit and open a pull request. It's preferable if
you open an issue first, or look at the open issues and assignments
before working, to make sure you're not overlaping with other contributors.

#Troubleshooting

I'm currently using:

```
node v6.4.0
npm 3.10.3
```

Try upgrading your version of node and run `yarn` again. Or open
an [issue](https://github.com/dvidsilva/gloria/issues) describing your problem.
