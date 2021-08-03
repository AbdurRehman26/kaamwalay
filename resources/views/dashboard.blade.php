<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <title>Robograding</title>
</head>
<body class="antialiased">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>

    <script src="{{ mix('/apps/dashboard/manifest.js') }}"></script>
    <script src="{{ mix('/apps/dashboard/vendor.js') }}"></script>
    <script src="{{ mix('/apps/dashboard/index.js') }}"></script>
</body>
</html>
