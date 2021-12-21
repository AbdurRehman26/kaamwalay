<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCouponSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->whereLike(
            [
                'code',
                'available_from',
                'couponStatus.code',
                'couponStatus.name',
                'couponStatus.name',
            ],
            $value
        );
    }
}
