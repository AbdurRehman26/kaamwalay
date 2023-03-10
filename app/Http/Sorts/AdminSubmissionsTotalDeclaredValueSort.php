<?php

namespace App\Http\Sorts;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminSubmissionsTotalDeclaredValueSort implements Sort
{
    /**
     * @param  Builder<Order>  $query
     */
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->withSum('orderItems', 'declared_value_total')->orderBy('order_items_sum_declared_value_total', $direction);
    }
}
