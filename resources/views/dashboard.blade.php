<x-layout appName="dashboard" :isSinglePageApp="true">
    <x-slot name="head">
        @if(config('services.paypal.client_id'))
            <script src="https://www.paypal.com/sdk/js?client-id={{ config('services.paypal.client_id') }}"></script>
        @endif
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>

        @if(config('services.facebook.pixel_id'))
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

        <noscript><img height="1" width="1" style="display:none"
                       src="https://www.facebook.com/tr?id={{ config('services.facebook.pixel_id') }}&ev=PageView&noscript=1"
            /></noscript>
        <!-- End Facebook Pixel Code -->
        @endif
    </x-slot>

    <x-slot name="body">
        @production
            <script src="//www.refersion.com/tracker/v3/pub_3752401d5d34d7b7d522.js"></script>
            <script>_refersion();</script>
        @endproduction
    </x-slot>
</x-layout>
