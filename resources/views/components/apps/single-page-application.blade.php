<!DOCTYPE html>
<html lang="{{ $getLang() }}">
    <head>
        <x-meta></x-meta>
        <x-head-scripts :appName="$appName"></x-head-scripts>
        <script src="https://www.paypal.com/sdk/js?client-id={{ config('services.paypal.client_id') }}"></script>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        <!-- Begin Inspectlet Asynchronous Code -->
        <script type="text/javascript">
        (function() {
        window.__insp = window.__insp || [];
        __insp.push(['wid', 1831631742]);
        var ldinsp = function(){
        if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=1831631742&r=' + Math.floor(new Date().getTime()/3600000); var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
        setTimeout(ldinsp, 0);
        })();
        </script>
        <!-- End Inspectlet Asynchronous Code -->
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <x-app :appName="$appName"></x-app>
    </body>
</html>
