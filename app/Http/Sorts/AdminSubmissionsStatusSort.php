<?php

namespace App\Http\Sorts;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminSubmissionsStatusSort implements Sort
{
    /**
     * @param  Builder<Order>  $query
     * @param  bool  $descending
     * @param  string  $property
     * @return void
     */
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->join('order_statuses', 'order_statuses.id', 'orders.order_status_id')->orderBy('order_statuses.name', $direction)->select('orders.*');
    }
}
