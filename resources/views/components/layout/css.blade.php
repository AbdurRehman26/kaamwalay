@inject('mix', "App\Services\MixService")

@if($mix->hasFile('/app.css', $appName))
    <link href="{{ $mix->getFile('/app.css', $appName) }}" rel="stylesheet" />
@endif

{{$slot}}
