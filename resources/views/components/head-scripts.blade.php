<?php
if (!isset($appName)) {
    $appName = 'landings';
}

$publicPath = '/apps/' . $appName . '/';
if (app()->environment("production")) {
    $publicPath = config('app.mix_url') . "/apps/" . $appName;
}
?>

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
<script>window.__public_path__ = '{{ $publicPath }}';</script>

@production
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
