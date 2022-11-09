<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCardSurfaceSearchFilter implements Filter
{
    /**
     * @return void
     */
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->whereLike(
            [
                'name',
            ],
            $value
        );
    }
}
