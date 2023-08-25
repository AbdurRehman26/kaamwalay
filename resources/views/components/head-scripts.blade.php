<?php
if (!isset($appName)) {
    $appName = 'landings';
}

$publicPath = '/apps/' . $appName . '/';
if (app()->environment("production")) {
    $publicPath = config('app.mix_url') . "/apps/" . $appName;
}
?>
<script>window.__public_path__ = '{{ $publicPath }}';</script>

@production
    <!-- Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZY908XVCZX"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-ZY908XVCZX');
    </script>
    <!-- End Google Tag Manager -->

    <!-- Begin Inspectlet Asynchronous Code -->
    <script type="text/javascript">
        (function () {
            window.__insp = window.__insp || [];
            __insp.push(['wid', 1831631742]);
            var ldinsp = function () {
                if (typeof window.__inspld != "undefined") return;
                window.__inspld = 1;
                var insp = document.createElement('script');
                insp.type = 'text/javascript';
                insp.async = true;
                insp.id = "inspsync";
                insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=1831631742&r=' + Math.floor(new Date().getTime() / 3600000);
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(insp, x);
            };
            setTimeout(ldinsp, 0);
        })();
    </script>
    <!-- End Inspectlet Asynchronous Code -->

    <!-- Begin TikTok Pixel -->
    <script>
        !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('CE2MCSRC77UF6213T2RG');
            ttq.page();
        }(window, document, 'ttq');
    </script>
    <!-- End TikTok Pixel -->
@endproduction
