<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminReferrerPayoutSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->whereLike(
            [
                'user.customer_number',
                'user.first_name',
                'user.last_name',
                'user.email',
            ],
            $value
        );
    }
}
