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
    $isLastPage = $endIndex > $totals;
@endphp

@if($totals > 0)
    <div class="pagination pagination--table">
        @if($totals > $itemsPerPage)
            <div class="pagination__limit">
                <label for="{{ $id }}" class="pagination__limit__label">Items per page:</label>
                <select id="{{ $id }}" class="pagination__limit__select">
                    @foreach($itemsPerPageOptions as $value)
                        <option
                            {{ $value === $itemsPerPage ? 'selected' : '' }} value="{{ $value }}">{{ $value }}</option>
                    @endforeach
                </select>
            </div>
        @endif
        <div class="pagination__navigation">
            <p class="pagination__navigation__pages">{{ $offset + 1 }} - {{ $endIndex }} of {{ $totals }}</p>

            <a {{ $isFirstPage ? 'disabled' : '' }} href="#"
               class="pagination__navigation__button pagination__navigation__button--prev">
                <span class="material-icons">chevron_left</span>
            </a>

            <a {{ $isLastPage ? 'disabled' : '' }} href="#"
               class="pagination__navigation__button pagination__navigation__button--next">
                <span class="material-icons">chevron_right</span>
            </a>
        </div>
    </div>
@endif
