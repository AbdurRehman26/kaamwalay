<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class OrdersService
{
    public function getPlacedOrders(User $user): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::class)
            ->placed()
            ->forUser($user)
            ->allowedFilters(['order_number'])
            ->allowedSorts(['grand_total'])
            ->defaultSort('-created_at')
            ->paginate($itemsPerPage);
    }
}
