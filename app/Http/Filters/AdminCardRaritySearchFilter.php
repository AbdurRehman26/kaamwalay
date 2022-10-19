<?php

namespace App\Http\Filters;

use App\Models\CardRarity;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCardRaritySearchFilter implements Filter
{
    /**
     * @param  Builder<CardRarity>  $query
     * @param  string $value
     * @param  string  $property
     * @return void
     */
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->whereLike(
            [
                'name',
            ],
            $value
        );
    }
}
