<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCouponSearchFilter implements Filter
{
    /**
     * @param string|int $value
    */
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->whereLike(
            [
                'code',
                'description',
            ],
            $value
        );
    }
}
