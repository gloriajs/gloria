# Gloria - static site generator

_gloria is spanish for glory, also the name of my mom and the name was available in npm_

**V2 is deprecating lots of old functions, make sure to read the migrating docs.** We're also slowly moving into typescript, and while I think it should work very well for your projects, legally I need to remind you that this is a satire of other projects.

[![Build Status](https://travis-ci.org/gloriajs/gloria.svg?branch=master)](https://travis-ci.org/dvidsilva/gloria)

This project aims to be a substitute for [jekyll](https://jekyllrb.com/), to help you create static websites without depending on ruby.

Because of its ease of use, extensibility and support for md files, is also great for creating websites out of documentatation that lives in a source code.

## Community

We're going to have a discord or something some day.

## Quickstart

Gloria aims to be the easiest simple static web generator there is, get yourself a good looking website for your portfolio, projects, community or hobbies in less than 5 minutes.

### Web

Fork the quick start theme repo and modify `_config.yml`, add and change pages, and publish to your [github pages](https://pages.github.com/) for free.

### Locally

Add gloria as a dependency `yarn add @gloriajs/gloria` and follow build and deploy instructions. We're using a `yarn.lock`.

### Custom domains

Github pages offers support for custom domains, follow the instructions on [their docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

[JS.org](https://js.org/) Offers free domains to open source

## Installation

Install globally or per project.

For more information check our [website](https://gloriajs.github.io).

Add the `@gloriajs` scope to your `.npmrc` or your project before installing. If added globally it only needs to be done once, but is better to add it on each project so your collaborators don't have to do it too before getting started. I can't remember my npm login, but once I figure it out we can also publish there I guess.

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

- `collect` - `[output]` traverses the include-paths and saves information about the available files
- `copy` - `[path] [dest]` copies the static files from source paths to dest folders
- `extract` - `[dest]` finds metadata and frontmatter information from every collected file
- `prebuild` - `[dest]` creates the output placeholders so they can be processed
- `build` - `[path] [dest]` interpolates the content into the layout & writes to temp folder
- `css` - `[path] [dest]` @TODO runs tailwin in the html output
- `scripts` - `[path] [dest]` @TODO processes scripts
- `write` - `[dest]` @TODO writes to disk
- `version` - ` ` returns the current package version

The commands all should work on their own, and the ones that combine multiple steps do it very nicely by using promises, we pass the project around, and store and read from its properties, to create new commands or amplify existing ones, for plugins and templates, review the data structure.

## Development and contributing

Refer to our [Contributing page](CONTRIBUTING.md) and local installation instructions.

**Here's our @TODO in no particular order for inspiration:**

- [ ] Write the previous commands to restore basic features
- [ ] Recreate documentation website
- [ ] Move to typescript
- [ ] Delete unused files
- [ ] Data sources / interpolation

## Data structure

The current data structure is something like:

```
const project = {
    prebuilt: {
        html,
        css,
    },
};
```

Once we're in typescript it will be much easier to see by referencing the interfaces.

## Tests

I removed this line `./node_modules/.bin/mocha --reporter spec` and need to add it later, but now that we're using TS and new testing tools have come out, perhaps we don't need mocha.

## Troubleshooting

Try on your own or open an [issue](https://github.com/gloriajs/gloria/issues) describing your problem.

Go for a walk and wait.

## google analytics

I recommend not tracking vanity metrics when you could be going for a walk, but if you must, add it to the layout or wait for a way to append_to_head using metadata from a page.

## Slava Ukraini

Gloria and Slava are the same word. A friend named Slava told me.
