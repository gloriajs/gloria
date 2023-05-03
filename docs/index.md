---
title: GloriaJS
description: Documentation for gloriajs
permalink: docs/
---

# Welcome to GloriaJS

The following commands are available and exist:

- [x] collect all files
- [x] collect assets
- [x] pre-process content pages
- [x] process content data and layouts
- [x] process tailwind
- [x] write to file system

We might open a discord later.

This project hopes to make simple websites super simple to create and deploy, specially for super easy things you don't wanna worry about, that way everyone can focus on their amazing content without worrying about obscure compile errors.

A configuration file looks like this:

```
name: Gloria JS
tagline: 'A simple static website generator'
baseurl: 'https://gloriajs.github.io'
author: 'daveed silva'
description: 'Documentation for the tool gloriajs'
dest: build
theme:
  - layouts/tailwind
css: tailwind
include:
  - docs
exclude:
  - '.draft.md'
copy:
  - public
```

You can add any additional properties here and they will be available for you in the templates as properties of <code>project.config</code>.

## Commands

The following commands are available to use


- `collect` - `[output]` traverses the include-paths and saves information about the available files
- `copy` - `[path] [dest]` copies the static files from source paths to dest folders
- `extract` - `[dest]` finds metadata and frontmatter information from every collected file
- `prebuild` - `[dest]` creates the output placeholders so they can be processed
- `build` - `[path] [dest]` interpolates the content into the layout
- `css:tailwind` - `[path] [dest]` runs tailwind in the html output
- `scripts` - `[path] [dest]` @TODO processes scripts
- `write` - `[dest]` @TODO writes production version to disk and cleans temp files
- `version` - ` ` returns the current package version

The commands all should work on their own, and the ones that combine multiple steps do it very nicely by using promises, we pass the project around, and store and read from its properties, to create new commands or amplify existing ones, for plugins and templates, review the data structure.

Find the website documentation in [github](https://github.com/gloriajs/gloriajs.github.io)

Or the live website in [gloria.js.org](https://gloria.js.org/)

<h1>Template</h1>

<p>Templates are html or markdown files, they are interpreted with <a href="https://www.npmjs.com/package/handlebars">handlebars</a>.</p>

<p>There are three main objects you can access on your template, <code>site</code> has access to the properties specified
    in <code>_config.yml</code>.
    <code>page</code> has access to the properties specified in the header of the page, and <code>args</code> has
    access to the arguments given to the command build. </p>

<h2>Layouts</h2>

<p>A layout file is used to have a structure common to different pages, for example a navigation menu, header, css includes,
    scripts, etc.</p>

<p>The name of the layout will be the name of the file, by default <code>default.html</code> is included, additional
    files included in the <code>_layout</code> folder will be used. If no layout exists or is especified the file
    will be rendered on its own.</p>

<p>The main thing that templates require is <code>&lbrace;&lbrace;&lbrace;page.content}}}</code> that will get replaced with the actual content
    of the page.</p>

<h2>Includes</h2>

<p>Include files, or also known as partials, are files that can be included in your content or layouts, they can be
    useful to reuse snippets like a <code>head</code> element, or a share button.</p>

<p>Any amount of partials and includes can exists, in the <code>_includes</code> folder, they are named as their file
    name, and they can be used like this <code>&lbrace;&lbrace;&gt; head}}</code>. Data will be interpolated there as expected.</p>

<h2>Frontmatter</h2>

<p>Every page can have additional attributes that will be accessible to it, the layout or the includes.</p>

<p>The additional attributes should be included in the beginning of the file in the following format, use three dashes
    in the first line of the file, and add any key pair of attributes using the
    <a href="https://learn.getgrav.org/advanced/yaml">Yaml</a> syntax, and finish with three dashes. Like this:
    <code></code>`</p>
<p>
    This change allows accessing variables defined in layouts' and includes' frontmatters. This could be achieved through the following syntax. {{ page.g.layout.var1}} for accessing layout variables or

{{ page.g.head.var1}} for accessing includes' (hbs partials) variables. head here is the name of the include. g (short for gloria) acts as a namespace to avoid collision between common variable names like 'title' or 'description'.

</p>
<hr>

<p>
    <pre><code>

---

title: About us
url: /about
description:

---

    </code></pre>
</p>

<hr>

<h2>Issues</h2>

<p>There's no layouts or including other files yet.</p>

<p>Roadmap, also includes having access to other pages, to be able to loop in blog posts, or read categories for example.</p>

<h1>Deployment</h1>

<p>You can use any service that lets you host HTML or static sites. The quickest ones to get working are <a href="https://pages.github.com/">github pages</a>            and
    <a href="https://firebase.google.com/docs/hosting/">firebase</a>.</p>

<h2>Firebase instructions</h2>

<p>Create a firebase account and a project, then run <code>firebase init</code> on your root folder and follow the instructions.
    When prompted what folder to use, chose your destination folder.</p>

<h2>Github pages instructions</h2>

<p>The best option to use github pages is to build your site to a folder called <code>docs</code>, push to a repo, and
    then select that folder in the github-pages configuration for that repo.</p>

<h1>Contributing</h1>
<p>
We are creating a contributing guide, find more information
<a href="/contributing">here</a>.
</p>


<h1>Troubleshooting</h1>

<p>I'm currently using:</p>

<p><pre><code>

node v6.4.0
npm 3.10.3
</code></pre></p>

        <p>Try upgrading your version of node and run <code>yarn</code> again. Or open an <a href="https://github.com/gloriajs/gloria/issues">issue</a>            describing your problem.</p>
    </div></div>

</div>
