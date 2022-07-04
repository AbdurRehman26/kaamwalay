<h4>
    {{ucfirst($title)}} Stats Report
</h4>

@foreach($report as $key => $value)
    <div>
        {{$key}} = {{$value}}
    </div>
@endforeach
