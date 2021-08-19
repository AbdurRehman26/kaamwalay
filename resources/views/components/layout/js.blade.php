@inject('mix', "App\Services\MixService")

@if($mix->hasFile('/manifest.js', $appName))
    <script async defer src="{{ $mix->getFile("/manifest.js", $appName) }}"></script>
@endif

@if($mix->hasFile('/vendor.js', $appName))
    <script async defer src="{{ $mix->getFile('/vendor.js', $appName) }}"></script>
@endif

@if($mix->hasFile('/index.js', $appName))
<script async defer src="{{ $mix->getFile('/index.js', $appName) }}"></script>
@endif

{{$slot}}
