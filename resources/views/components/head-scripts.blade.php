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
