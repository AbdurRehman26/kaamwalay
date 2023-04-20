<?php

namespace  App\Services\Order\V3;

use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;
use App\Models\Order;

class OrderService
{

    public function getOrder(int $orderId): Model
    {
        return QueryBuilder::for(Order::class)
            ->allowedIncludes(Order::getAllowedIncludes())
            ->findOrFail($orderId);
    }

}
