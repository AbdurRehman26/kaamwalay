<?php

namespace  App\Services\Order\V3;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;
use App\Models\Order;

class OrderService
{
    /**
     * @return LengthAwarePaginator<Order>
     */
    public function getOrders(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->excludeCancelled()
            ->forUser($user)
            ->withSum('orderItems as number_of_cards', 'quantity')
            ->withSum('orderItems as total_declared_value', 'declared_value_total')
            ->allowedIncludes(Order::getAllowedIncludes())
            ->allowedFilters(Order::getAllowedFilters())
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->findOrFail($orderId);
    }

}
