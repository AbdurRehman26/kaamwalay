@php
    $defaultTitle = 'Robograding - Card Grading by Artificial Intelligence - Faster, more accurate & ethical.';
    $defaultDescription = 'Robograding allows you to grade cards with the help of Artificial Intelligence. It is more economical, 100% transparent, more accurate than human-grading, and 10-times faster!';
    $defaultImage = 'https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-meta-image.jpg';
    $defaultFavicon = 'https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-favicon.png';
@endphp

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://d2eli1wrotxo1h.cloudfront.net" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Material+Icons&display=swap" rel="stylesheet">

<title>{{ $title ?? $defaultTitle }}</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="robots" content="index, follow" />
<meta property="og:type" content="website" />
<meta property="og:image:width" content="1036" />
<meta property="og:image:height" content="1036" />
<meta name="twitter:creator" content="Robograding" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="{{ $keywords ?? '' }}"/>
<meta property="og:locale" content="{{ app()->getLocale() }}" />
<link rel="home" href="{{ url('/') }}" />
<meta itemProp="url" content="{{ request()->url() }}" />
<meta property="og:url" content="{{ request()->url() }}" />
<meta name="twitter:url" content="{{ request()->url() }}"/>
<meta name="twitter:site" content="{{ url('/') }}"/>
<meta property="og:title" content="{{ $title ?? $defaultTitle }}" />
<meta name="description" content="{{ $description ?? $defaultDescription }}">
<meta property="og:description" content="{{ $description ?? $defaultDescription }}">
<link rel="shortcut icon" href="{{ $favicon ?? $defaultFavicon }}" />
<meta itemProp="image" content="{{ $image ?? $defaultImage }}" />
<meta property="og:image" content="{{ $image ?? $defaultImage }}" />
<meta name="twitter:image" content="{{ $image ?? $defaultImage }}" />
<meta itemProp="thumbnailUrl" content="{{ $image ?? $defaultImage }}" />
<link rel="image_src" href="{{ $image ?? $defaultImage }}" />
