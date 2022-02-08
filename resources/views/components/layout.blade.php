<!DOCTYPE html>
@php
    $appName ??= 'landings';
    $isSinglePageApp ??= false;
@endphp
<html class="page" lang="{{ app()->getLocale() }}">
    <head>
        <x-meta/>
        <x-head-scripts :appName="$appName"/>
        <x-layout.preload :appName="$appName"/>
        <x-layout.css :appName="$appName"/>
        {{ $head ?? '' }}
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
    </body>
</html>
