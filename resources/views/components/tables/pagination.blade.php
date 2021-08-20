@php
    use Illuminate\Support\Str;

    $id = Str::replace(".", "_", uniqid('select-items_', true));
    $itemsPerPageOptions = [24, 48, 72, 96, 120];
    $itemsPerPage = (int)($itemsPerPage ?? 0);
    $totals = (int)($totals ?? 0);
    $offset = (int)($offset ?? 0);
@endphp

<div class="table__pagination">
    <div class="table__pagination__items-per-page">
        <label for="{{ $id }}">Items per page:</label>
        <select id="{{ $id }}">
            @foreach($itemsPerPageOptions as $value)
                <option {{ $value === $itemsPerPage ? 'selected' : '' }} value="{{ $value }}">{{ $value }}</option>
            @endforeach
        </select>
    </div>
    @if($totals > $itemsPerPage)
        <div class="table__pagination__navigation">
            <p class="table-pagination__pages">{{ $offset + 1 }} - {{ $offset + $itemsPerPage }} of {$totals}</p>

            <a href="#" class="table-pagination__page-nav table-pagination__page-nav--prev">
                <span class="material-icons">chevron_left</span>
            </a>
            <a href="#" class="table-pagination__page-nav table-pagination__page-nav--next">
                <span class="material-icons">chevron_right</span>
            </a>
        </div>
    @endif
</div>
