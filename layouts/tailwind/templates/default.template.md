---
name: tailwind
---
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- @TODO: replace with tailwind cli because this is bringing in too much kbs - but this is faster for now -->
  <script src="https://cdn.tailwindcss.com"></script>
  <title>{{ > page.title }}</title>
  {{ > site.head }}
  {{ > page.head}}
</head>

<body>
  <header class="container">
    <div class="page-header">
      <h1 class="text-3xl font-bold underline">
        <a href="/">Gloria</a> <small>static site generator</small>
      </h1>
    </div>
    <nav>
      <a href="/blog">Blog</a>
    </nav>
  </header>
  {{{page.content}}}
</body>

</html>