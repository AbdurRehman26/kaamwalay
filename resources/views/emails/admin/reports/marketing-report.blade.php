@component('mail::message')
    {{ $templateInfo['heading'] }}
    @component('mail::table')
        | Title       | Value         |
        | :--------- | :------------- |
        @foreach ($report as $key => $value)
            | {{$key}} | {{$value}} |
        @endforeach
    @endcomponent
@endcomponent
