<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Order\UpdateOrderShippingMethodRequest;
use App\Http\Resources\API\V2\Customer\Order\OrderResource;
use App\Models\Order;

class UpdateOrderShippingMethodController extends Controller
{
    public function __invoke(
        UpdateOrderShippingMethodRequest $request,
        Order $order
    ): OrderResource {
        return new OrderResource($order);
    }
}
