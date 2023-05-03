---
layout: index
name: blog
title: Blog
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{site.title}}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="{{head.css_path}}">
  <style>
    {{page.inline_styles}}
  </style>
</head>
<body>
  <div class="container mx-auto px-4">
    <div>
      <h1>{{page.title}}</h1>
      <main>
        {{{page.content}}}
      </main>
    </div>
  </div>
</body>
</html>
