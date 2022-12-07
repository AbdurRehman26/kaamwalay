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
            <!-- TikTok Pixel Code -->
            <script>
                !function (w, d, t) {
                    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                    ttq.load('CE2MCSRC77UF6213T2RG');
                    ttq.page();
                }(window, document, 'ttq');
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
