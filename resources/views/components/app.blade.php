<script src="{{ mix("/manifest.js", "apps/$appName") }}"></script>
@php
    $appName ??= 'landings';
    try {
        echo "<script src=\"" . mix("/vendor.js", "apps/$appName") . "\"></script>";
    } catch (Exception $e) {
        // Nothing
    }
@endphp

<script src="{{ mix("/index.js", "apps/$appName") }}"></script>
{{$slot}}
