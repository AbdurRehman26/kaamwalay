<?php

namespace App\Services\Admin;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
    public function getOrders(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->allowedFilters([
                AllowedFilter::exact('order_id', 'id'),
                AllowedFilter::scope('status'),
                AllowedFilter::scope('order_status', 'status'),
                AllowedFilter::scope('customer_name'),
                AllowedFilter::scope('customer_id'),
            ])
            ->allowedIncludes([
                AllowedInclude::relationship('customer', 'user'),
                AllowedInclude::relationship('orderStatus'),
                AllowedInclude::relationship('orderStatusHistory'),
                AllowedInclude::relationship('orderStatusHistory.orderStatus'),
            ])
            ->allowedSorts(['grand_total'])
            ->defaultSort('-created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model | QueryBuilder
    {
        return QueryBuilder::for(Order::class)
            ->where('id', $orderId)
            ->allowedIncludes([
                AllowedInclude::relationship('customer', 'user'),
                AllowedInclude::relationship('orderStatus'),
                AllowedInclude::relationship('orderStatusHistory'),
                AllowedInclude::relationship('orderStatusHistory.orderStatus'),
            ])
            ->firstOrFail();
    }
}
