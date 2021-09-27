<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminOrderSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->where(function (Builder $query) use ($value) {
            $query->where('order_number', 'like', "%$value%")
                ->orWhereHas(
                    'user',
                    function ($query) use ($value) {
                        $query->where('customer_number', 'like', "%$value%")
                            ->orWhere('first_name', 'like', "%$value%")
                            ->orWhere('last_name', 'like', "%$value%");
                    }
                );
        });
    }
}
