<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\AddExtraChargeRequest;
use App\Http\Requests\API\Admin\Order\RefundOrderRequest;
use App\Http\Requests\API\Admin\Order\UpdateOrderPaymentRequest;
use App\Http\Resources\API\Admin\Order\OrderPaymentResource;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\Admin\OrderService;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderPaymentController extends Controller
{
    public function update(
        UpdateOrderPaymentRequest $request,
        Order $order,
        OrderPayment $orderPayment,
    ): OrderPaymentResource {
        $orderPayment->update($request->all());

        return new OrderPaymentResource($order->lastOrderPayment);
    }
}
