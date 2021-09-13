<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
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
            ->allowedIncludes(Order::GetAllowedAdminIncludes())
            ->allowedFilters(['order_number'])
            ->allowedSorts(['grand_total'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getGroupedOrderItems(int $orderId)
    {
        return OrderItem::select('card_product_id', 'declared_value_total', 'declared_value_per_unit', DB::raw('sum(quantity) as quantity'))
        ->where('order_id', $orderId)
        ->groupBy(['card_product_id', 'declared_value_total','declared_value_per_unit'])
        ->get();
    }
}
