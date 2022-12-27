---
name: GloriaJS
description: Docs index for gloriajs
---
<header>
    <div class="inner">
    <h1>Welcome to GloriaJS</h1>
    <h2>{{page.description}}</h2>
    </div>
</header>

<div class="container">
    <h1>Join Gloria in Slack</h1>
    <p>We have a slack team where you can get support, help for contributing, or where you can
        participate shaping the future of the project.
        <a href="http://slack.gloriajs.com">Go here to request an invite</a>.
    </p>

    <div id="output" class="content markdown-body">
        <p>
            <em>gloria is spanish for glory, also the name of my mom and the name was available in npm</em></p>

        <p>This project aims to be a substitute for
            <a href="https://jekyllrb.com/">jekyll</a>, to help you create static websites without depending on ruby.</p>

        <p><strong>WARNING: this is a work in progress</strong> it only has access to a very limited set of features, and support
            can be dropped in any moment.</p>

        <h1>Installation</h1>

        <p>Use <a href="https://www.npmjs.com">npm</a> to install.</p>

        <p><code>
npm install -g gloria
</code></p>

        <h1>Usage</h1>

        <p>Now gloria is globally installed in your computer, and you can run commands like <code>gloria --version</code> to
            retrieve the version.</p>

        <h1>_CONFIG.yml</h1>

        <p>The file _config.yml has some important information about your site in
            <a href="https://learn.getgrav.org/advanced/yaml">Yaml</a> format.</p>

        <p>Only two values are required, name and location. The default file looks something like this:</p>

        <p><pre><code>
name: sampleblog
location: sampleblog
layout: default
author: 'david silva'
description: 'Sample site created with gloria'
version: 1.0.0
</code></pre>
    You can add any amount of data here and it will be available for you in the templates as properties of <code>site</code>.
            Look in the <a href="#template">template</a> documentation for more info.</p>

        <h1>Commands</h1>

        <p>The following commands are available to use</p>

        <h2>Init</h2>

        <p><code>gloria init [name]</code></p>

        <p>Will create a new project in a specified folder.</p>

        <p>Options can be passed in the command like <code>--name=myBlog</code> or given in the interactive prompt.</p>

        <h2>Build</h2>

        <p><code>gloria build [dest] --clear=false</code></p>

        <p>Builds the site into the desired destination. By default it will use a folder name 'site' in the root directory of
            the project. It won't build to a parent folder. The command will fail if _config.yml is invalid or not present.</p>

        <p>If clear equals true it will empty the destination directory before processing and copying content to it.</p>

        <p>Any amount of key-value pairs can be passed to the build command, like <code>title='A New Adventure</code> and they
            will be available to use in your templates as properties of <code>args</code>.</p>

        <h2>Serve</h2>

        <p>Will spawn a web server to allow access to the built files, using the provided <code>dest</code> argument, or the
            one stored in the site configuration.</p>

        <h2>Help</h2>

        <p><code>gloria --help</code></p>

        <p>Will provide a list of commands and options available.</p>

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