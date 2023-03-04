<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminOrderSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $fullNameArray = explode(' ', $value);
        if (count($fullNameArray) === 2) {
            $query->whereLike('user.first_name', $fullNameArray[0])->whereLike('user.last_name', $fullNameArray[1]);
        } else {
            $query->whereLike(
                [
                    'order_number',
                    'user.customer_number',
                    'user.first_name',
                    'user.last_name',
                    'user.email',
                    'orderItems.userCard.certificate_number',
                ],
                $value
            );
        }
    }
}
