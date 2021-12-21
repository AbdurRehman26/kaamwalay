<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;

class AdminCouponSearchFilter implements \Spatie\QueryBuilder\Filters\Filter
{

    public function __invoke(Builder $query, $value, string $property)
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
