<?php

namespace App\Http\Controllers\API\V1\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Order\UpdateOrderPaymentRequest;
use App\Http\Resources\API\V1\Admin\Order\OrderPaymentResource;
use App\Models\Order;
use App\Models\OrderPayment;

class OrderPaymentController extends Controller
{
    public function update(
        UpdateOrderPaymentRequest $request,
        Order $order,
        OrderPayment $orderPayment,
    ): OrderPaymentResource {
        $orderPayment->update($request->all());

        return new OrderPaymentResource($orderPayment);
    }
}
