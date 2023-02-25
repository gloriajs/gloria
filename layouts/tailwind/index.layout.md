---
title: Welcome!
description: Meow
permalink: ''
name: index
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{page.title}}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="{{head.css_path}}">
  <style>
    {{page.inline_styles}}
  </style>
</head>
<body>
  <div class="">
    <div>
      {{{content}}}
    </div>
  </div>
</body>
</html>
