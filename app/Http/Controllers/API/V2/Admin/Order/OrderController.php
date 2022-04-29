<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Http\Controllers\API\V1\Admin\Order\OrderController as V1OrderController;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;

class OrderController extends V1OrderController
{
    public function show(int $orderId): OrderResource
    {
        $order = $this->ordersService->getOrder($orderId);

        return new OrderResource($order);
    }
}
