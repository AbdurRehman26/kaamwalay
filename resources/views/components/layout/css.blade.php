@inject('mix', "App\Services\MixService")

<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Material+Icons&display=swap" rel="stylesheet">

@if($mix->hasFile('/app.css', $appName))
    <link href="{{ $mix->getFile('/app.css', $appName) }}" rel="stylesheet" />
@endif

{{$slot}}
