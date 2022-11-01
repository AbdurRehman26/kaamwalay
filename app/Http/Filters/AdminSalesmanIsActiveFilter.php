<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminSalesmanIsActiveFilter implements Filter
{
    /**
     * @param string $value
     */
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->whereHas('salesmanProfile', function ($subQuery) use ($value){
            $subQuery->where('is_active',  $value);
        });
    }
}
