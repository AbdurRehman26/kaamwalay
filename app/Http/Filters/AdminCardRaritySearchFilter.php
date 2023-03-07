<?php

namespace App\Http\Filters;

use App\Models\CardRarity;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCardRaritySearchFilter implements Filter
{
    /**
     * @param  Builder<CardRarity>  $query
     */
    public function __invoke(Builder $query, string $value, string $property): void
    {
        $query->whereLike(
            [
                'name',
            ],
            $value
        );
    }
}
