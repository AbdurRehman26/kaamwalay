<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminOrderSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->whereLike(
            [
                'order_number',
                'user.customer_number',
                'user.first_name',
                'user.last_name',
                'orderItems.userCard.certificate_number',
            ],
            $value,
        );
    }
}
