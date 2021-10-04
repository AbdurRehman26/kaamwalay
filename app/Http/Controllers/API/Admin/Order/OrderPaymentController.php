<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\AddExtraChargeRequest;
use App\Http\Requests\API\Admin\Order\UpdateOrderPaymentRequest;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\Admin\OrderService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderPaymentController extends Controller
{
    public function addExtraCharge(
        AddExtraChargeRequest $request,
        Order $order,
        OrderService $orderService,
    ): JsonResponse {
        $orderService->addExtraCharge(order: $order, data: $request->all());

        return (new OrderPaymentResource($order->lastOrderPayment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(
        UpdateOrderPaymentRequest $request,
        Order $order,
        OrderPayment $orderPayment,
    ): OrderPaymentResource {
        $orderPayment->update($request->all());

        return new OrderPaymentResource($order->lastOrderPayment);
    }
}
