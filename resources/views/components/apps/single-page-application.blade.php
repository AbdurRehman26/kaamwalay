<!DOCTYPE html>
<html lang="{{ $lang }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <title>{{ $title }}</title>
        <script>window.__public_path__ = '{{$publicPath}}';</script>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script src="{{ mix("/manifest.js", "apps/$app") }}"></script>
        <script src="{{ mix("/vendor.js", "apps/$app") }}"></script>
        <script src="{{ mix("/index.js", "apps/$app") }}"></script>
    </body>
</html>
