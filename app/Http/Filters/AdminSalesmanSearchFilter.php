<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminSalesmanSearchFilter implements Filter
{
    /**
     * @param string $value
     */
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->whereLike(
            [
                'first_name',
                'last_name',
                'email',
                'phone',
            ],
            $value
        );
    }
}
