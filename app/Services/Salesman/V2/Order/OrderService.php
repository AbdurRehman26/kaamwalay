<?php

namespace App\Services\Salesman\V2\Order;

use App\Models\Order;
use App\Services\Admin\Order\OrderItemService;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class OrderService
{
    public function __construct(
        protected OrderItemService $orderItemService,
        protected AgsService $agsService
    ) {
    }

    public function getOrders(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return QueryBuilder::for(Order::query()->salesmanId(auth()->user()->id))
            ->excludeCancelled()
            ->allowedFilters(Order::getAllowedAdminFilters())
            ->allowedIncludes(Order::getAllowedAdminIncludes())
            ->allowedSorts(Order::getAllowedAdminSorts())
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    public function getOrder(int $orderId): Model | QueryBuilder
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedAdminIncludes())
            ->findOrFail($orderId);
    }

}
