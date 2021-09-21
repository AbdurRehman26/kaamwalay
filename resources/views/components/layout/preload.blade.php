@inject('mix', "App\Services\MixService")

@if($mix->hasFile('/app.css', $appName))
    <link rel="preload" href="{{ $mix->getFile('/app.css', $appName) }}" as="style">
@endif

@if($mix->hasFile('/manifest.js', $appName))
    <link rel="preload" href="{{ $mix->getFile("/manifest.js", $appName) }}" as="script">
@endif

@if($mix->hasFile('/vendor.js', $appName))
    <link rel="preload" href="{{ $mix->getFile('/vendor.js', $appName) }}" as="script">
@endif

@if($mix->hasFile('/index.js', $appName))
    <link rel="preload" href="{{ $mix->getFile('/index.js', $appName) }}" as="script">
@endif

{{$slot}}
