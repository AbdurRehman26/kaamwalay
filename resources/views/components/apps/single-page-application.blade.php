<!DOCTYPE html>
<html lang="{{ $getLang() }}">
    <head>
        <title>Robograding - Card Grading by Artificial Intelligence - Faster, more accurate & ethical.</title>
        <meta name="description" content="Robograding allows you to grade cards with the help of Artificial Intelligence. It is more economical, 100% transparent, more accurate than human-grading, and 10-times faster!">
        <meta charset="utf-8">
        <meta name="viewport" content="width=1280">
        <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="" />
        <link rel="shortcut icon" href="https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-favicon.png" />
        <meta name="robots" content="index, follow" />
        <meta property="og:locale" content="$getLang()" />
        <link rel="home" href="{{ url('/') }}" />
        <link rel="canonical" href="{{ url('/') }}" />
        <meta itemProp="url" content="{{ url('/') }}" />
        <meta property="og:url" content='{{ url('/') }}' />
        <meta itemProp="image" content="https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-meta-image.jpg" />
        <meta property="og:image" content="https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-meta-image.jpg" />
        <meta name="twitter:image" content="https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-meta-image.jpg" />
        <meta itemProp="thumbnailUrl" content="https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-meta-image.jpg" />
        <link rel="image_src" href="https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-meta-image.jpg" />
        <meta itemProp="url" content="{{ url('/') }}"/>
        <meta property="og:url" content="{{ url('/') }}"/>
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="1036" />
        <meta property="og:image:height" content="1036" />
        <meta name="twitter:url" content="{{ url('/') }}"/>
        <meta name="twitter:site" content="{{ url('/') }}"/>
        <meta name="twitter:creator" content="Robograding" />
        <meta name="twitter:card" content="summary_large_image" />

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
