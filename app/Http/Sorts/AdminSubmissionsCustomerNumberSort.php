<?php

namespace App\Http\Sorts;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminSubmissionsCustomerNumberSort implements Sort
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

        $query->join('users', 'users.id', 'orders.user_id')->orderBy('users.customer_number', $direction)->select('orders.*');
    }
}
