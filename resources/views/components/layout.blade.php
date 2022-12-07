<!DOCTYPE html>
@php
    $appName ??= 'landings';
    $isSinglePageApp ??= false;
@endphp
<html class="page" lang="{{ app()->getLocale() }}">
    <head>
        <x-meta :title="$title ?? null" :description="$description ?? null" :image="$seoImage ?? null"/>
        <x-head-scripts :appName="$appName"/>
        <x-layout.preload :appName="$appName"/>
        <x-layout.css :appName="$appName"/>
        {{ $head ?? '' }}
        @production
            <!-- Facebook Pixel Code -->
            <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', "{{ config('services.facebook.pixel_id') }}");
                fbq('track', 'PageView');
            </script>
        @endproduction
    </head>
    <body class="page__body {{ $pageClass ?? '' }}">
        @if($isSinglePageApp)
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
        @else
            {{ $beforeHeader ?? '' }}
            @if(isset($header) && $header)
                {{ $header  }}
            @else
                <x-layout.header/>
            @endif
            {{ $afterHeader ?? '' }}

            <x-layout.content>
                {{ $slot }}
            </x-layout.content>

            {{ $beforeFooter ?? '' }}
            @if(isset($footer) && $footer)
                {{ $footer  }}
            @else
                <x-layout.footer/>
            @endif
            {{ $afterFooter ?? '' }}
        @endif

        <x-layout.js :appName="$appName"/>
        {{ $body ?? '' }}

        @production
            <script src="//www.refersion.com/tracker/v3/pub_3752401d5d34d7b7d522.js"></script>
            <script>_refersion();</script>
        @endproduction
    </body>
</html>
