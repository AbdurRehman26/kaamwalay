<?php

namespace App\Services\Admin\Card;

use App\Models\CardRarity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class CardRarityService
{
    protected const LIST_CARD_RARITY_PER_PAGE = 15;

    public function getCardRarities(): LengthAwarePaginator
    {
        return QueryBuilder::for(CardRarity::class)
            ->allowedFilters([
            ])
            ->allowedSorts([
            ])
            ->allowedIncludes([

            ])
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::LIST_CARD_RARITY_PER_PAGE));
    }
}
