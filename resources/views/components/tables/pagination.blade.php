@php
    use Illuminate\Support\Str;

    $id = Str::replace(".", "_", uniqid('select-items_', true));
    $itemsPerPageOptions = [24, 48, 72, 96, 120];
    $itemsPerPage = (int)($itemsPerPage ?? 0);
    $totals = (int)($totals ?? 0);
    $offset = (int)($offset ?? 0);

    $startIndex = $offset;
    $endIndex = $offset + $itemsPerPage;
    $isFirstPage = $offset === 0;
    $isLastPage = $endIndex >= $totals;
@endphp

@if($totals > 0)
    <div class="pagination pagination--table">
        <div class="pagination__limit">
            <label for="{{ $id }}" class="pagination__limit__label">Items per page:</label>
            <select id="{{ $id }}" class="pagination__limit__select">
                @foreach($itemsPerPageOptions as $value)
                    <option
                        {{ $value === $itemsPerPage ? 'selected' : '' }} value="{{ $value }}">{{ $value }}</option>
                @endforeach
            </select>
        </div>

        <div class="pagination__navigation">
            <p class="pagination__navigation__pages">{{ $offset + 1 }} - {{ $endIndex > $totals ? $totals : $endIndex }} of {{ $totals }}</p>

            <a href="{{route('feed.list',['page' => $currentPage - 1, 'per_page' => $itemsPerPage])}}"
               class="pagination__navigation__button {{ $isFirstPage ? 'pagination__navigation__button__disabled' : '' }} pagination__navigation__button--prev">
                <span class="material-icons">chevron_left</span>
            </a>

            <a href="{{route('feed.list',['page' => $currentPage + 1, 'per_page' => $itemsPerPage])}}"
               class="pagination__navigation__button {{ $isLastPage ? 'pagination__navigation__button__disabled' : '' }} pagination__navigation__button--next">
                <span class="material-icons">chevron_right</span>
            </a>
        </div>
    </div>
@endif
