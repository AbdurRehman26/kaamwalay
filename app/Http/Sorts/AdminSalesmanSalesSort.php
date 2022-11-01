<?php

namespace App\Http\Sorts;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminSalesmanSalesSort implements Sort
{
    /**
     * @param  Builder<User>  $query
     * @param  bool  $descending
     * @param  string  $property
     * @return void
     */
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->withSum('orders', 'grand_total')->orderBy('order_sum_grand_total', $direction);
    }
}

