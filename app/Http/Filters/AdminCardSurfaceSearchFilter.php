<?php

namespace App\Http\Filters;

use App\Models\CardSurface;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCardSurfaceSearchFilter implements Filter
{
    /**
     * @param  Builder<CardSurface>  $query
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
