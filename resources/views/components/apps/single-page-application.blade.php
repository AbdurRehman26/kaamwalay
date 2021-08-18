<!DOCTYPE html>
<html lang="{{ $getLang() }}">
    <head>
        <x-meta></x-meta>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <script>window.__public_path__ = '{{$getPublicPath()}}';</script>
        <script src="https://www.paypal.com/sdk/js?client-id={{ config('services.paypal.client_id') }}"></script>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script src="{{ mix("/manifest.js", "apps/$app") }}"></script>
        <script src="{{ mix("/vendor.js", "apps/$app") }}"></script>
        <script src="{{ mix("/index.js", "apps/$app") }}"></script>
    </body>
</html>
