<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCustomerSearchFilter implements Filter
{

    public function __invoke(Builder $query, $value, string $property)
    {
        $query->whereLike(
            [
                'first_name',
                'last_name',
                'email',
                'phone',
                'customer_number',
            ],
            $value
        );
    }
}
