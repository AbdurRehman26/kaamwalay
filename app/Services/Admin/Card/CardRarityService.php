<?php

namespace App\Services\Admin\Card;

use App\Http\Filters\AdminCardRaritySearchFilter;
use App\Models\CardRarity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CardRarityService
{
    protected const LIST_CARD_RARITY_PER_PAGE = 15;

    // @phpstan-ignore-next-line
    public function getCardRarities(): LengthAwarePaginator
    {
        return QueryBuilder::for(CardRarity::class)
            ->allowedFilters([
                AllowedFilter::scope('card_category'),
                AllowedFilter::custom('search', new AdminCardRaritySearchFilter),
            ])
            ->defaultSort('-created_at')
            ->allowedSorts(['name'])
            ->paginate(request('per_page', self::LIST_CARD_RARITY_PER_PAGE));
    }
}
