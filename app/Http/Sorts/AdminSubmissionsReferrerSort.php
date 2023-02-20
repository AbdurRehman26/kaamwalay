<?php

namespace App\Http\Sorts;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminSubmissionsReferrerSort implements Sort
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

        $query->leftJoin('users as order_user', 'order_user.id', '=', 'orders.user_id')
        ->leftJoin('users as referrer', 'referrer.id', '=', 'order_user.referred_by')
        ->orderBy('referrer.first_name', $direction)
        ->orderBy('referrer.last_name', $direction)
        ->select('orders.*');
    }
}
