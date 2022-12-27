# Gloria - static site generator

*gloria is spanish for glory, also the name of my mom and the name was available in npm*

**V2 is deprecating lots of old functions, make sure to read the migrating docs.**

[![Build Status](https://travis-ci.org/gloriajs/gloria.svg?branch=master)](https://travis-ci.org/dvidsilva/gloria)

This project aims to be a substitute for [jekyll](https://jekyllrb.com/), to help you create static websites without depending on ruby.

## Community

We're going to have a discord or something some day.

## Quickstart

Gloria aims to be the easiest simple static web generator there is, get yourself a good looking website for your portfolio, projects, community or hobbies in less than 5 minutes.

### Web

Fork the quick start theme repo and modify `_config.yml`, add and change pages, and publish to your [github pages](https://pages.github.com/) for free.

### Locally

Add gloria as a dependency `yarn add @gloriajs/gloria` and follow build and deploy instructions.

### Custom domains

Github pages offers support for custom domains, follow the instructions on [their docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

[JS.org](https://js.org/) Offers free domains to open source

## Installation

Install globally or per project.

For more information check our [website](https://gloriajs.github.io).

Add the `@gloriajs` scope to your `.npmrc` or your project before installing. If added globally it only needs to be done once, but is better to add it on each project so your collaborators don't have to do it too before getting started.

```
@gloriajs:registry=npm.pkg.github.com
```
Install by
```
npm i @gloriajs/gloria
```

## Usage

Now gloria is globally installed in your computer, and you can run commands like `gloria --version` to retrieve the version. Or if installed per project you can use npx.

### Locally

Clone this repo and point to it from another one adding this line to your dependencies:

```
    "gloria-local": "./node_modules/gloria-local/bin/gloria"
```

Then you can add scripts to your `package.json` as:

```
    "gloria-local": "./node_modules/gloria-local/bin/gloria"
```

And use `gloria` from that folder like:

```
npm run gloria-local -- --version
```

## Commands

* `collect` - `[output]` traverses the include-paths and saves information about the available files


## Development and contributing

Refer to our [Contributing page](CONTRIBUTING.md) and local installation instructions above.

## Troubleshooting

Try upgrading your version of node and run `yarn` again. Or open an [issue](https://github.com/gloriajs/gloria/issues) describing your problem. Go for a walk and check whether that's what you want to be doing today.
