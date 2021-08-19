<!DOCTYPE html>
<html lang="{{ $getLang() }}">
    <head>
        <x-meta></x-meta>
        <x-head-scripts :appName="$appName"></x-head-scripts>
        <script src="https://www.paypal.com/sdk/js?client-id={{ config('services.paypal.client_id') }}"></script>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <x-app :appName="$appName"></x-app>
    </body>
</html>
