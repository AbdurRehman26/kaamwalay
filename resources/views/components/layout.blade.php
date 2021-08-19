<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <x-meta></x-meta>
    <x-head-scripts appName="landings"></x-head-scripts>
</head>
<body>
{{$slot}}
<x-app appName="landings"></x-app>
</body>
</html>
