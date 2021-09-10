<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
    public function getOrders(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->placed()
            ->forUser($user)
            ->allowedIncludes([
                AllowedInclude::relationship('invoice'),
                AllowedInclude::relationship('paymentPlan'),
                AllowedInclude::relationship('orderItems'),
                AllowedInclude::relationship('orderStatus'),
                AllowedInclude::relationship('orderStatusHistory'),
                AllowedInclude::relationship('orderStatusHistory.orderStatus'),
            ])
            ->allowedFilters(['order_number'])
            ->allowedSorts(['grand_total'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }
}
