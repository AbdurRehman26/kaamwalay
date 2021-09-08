<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\QueryBuilder;

class OrdersService
{
    public function getCustomerPlacedOrders(User $user): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->placed()
            ->forUser($user)
            ->allowedSorts(['grand_total'])
            ->defaultSort('-created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrders(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');
        $allowedFilters = [
            AllowedFilter::exact('order_id', 'id'),
            AllowedFilter::scope('status'),
            AllowedFilter::scope('customer_name'),
            AllowedFilter::scope('customer_id'),
        ];

        return QueryBuilder::for(Order::class)
            ->allowedFilters($allowedFilters)
            ->allowedSorts(['grand_total'])
            ->defaultSort('-created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $order): Model | QueryBuilder
    {
        return QueryBuilder::for(Order::class)
            ->where('id', $order)
            ->allowedIncludes([
                AllowedInclude::relationship('customer', 'user'),
            ])
            ->firstOrFail();
    }
}
