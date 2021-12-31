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
    <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-ND5DFP9');
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
@endproduction
