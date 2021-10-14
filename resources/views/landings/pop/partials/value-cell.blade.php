<td class="pop-list__table-cell pop-list__table-cell--value">
    @if(!!$href)
        <a href="{{ $href }}">
            {{$zeroValue}}
            <br/>
            {{$plusValue}}
        </a>
    @else
        {{$zeroValue}}
        <br/>
        {{$plusValue}}
    @endif
</td>