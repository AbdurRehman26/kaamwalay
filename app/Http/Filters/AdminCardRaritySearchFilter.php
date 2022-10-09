<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCardRaritySearchFilter implements Filter
{
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
