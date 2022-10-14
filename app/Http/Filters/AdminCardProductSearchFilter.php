<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCardProductSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->whereLike(
            [
                'name',
                'rarity',
                'edition',
                'surface',
                'variant',
            ],
            $value
        );
    }
}
