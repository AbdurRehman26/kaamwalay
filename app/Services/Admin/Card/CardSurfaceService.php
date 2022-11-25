<?php

namespace App\Services\Admin\Card;

use App\Models\CardSurface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CardSurfaceService
{
    protected const LIST_CARD_SURFACE_PER_PAGE = 15;

    // @phpstan-ignore-next-line
    public function getCardSurfaces(): LengthAwarePaginator
    {
        return QueryBuilder::for(CardSurface::class)
            ->allowedFilters([
                AllowedFilter::scope('card_category'),
                AllowedFilter::scope('search'),
            ])
            ->defaultSort('-created_at')
            ->allowedSorts(['name'])
            ->paginate(request('per_page', self::LIST_CARD_SURFACE_PER_PAGE));
    }
}
