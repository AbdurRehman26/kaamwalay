<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\AddExtraChargeRequest;
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
    /**
     * @throws Throwable
    */
    public function addExtraCharge(
        AddExtraChargeRequest $request,
        Order $order,
        OrderService $orderService,
        PaymentService $paymentService,
    ): JsonResponse {
        $requestData = $request->all() + [
            'type' => OrderPayment::TYPE_EXTRA_CHARGE,
            'payment_method_id' => $order->payment_method_id,
        ];
        $extraChargeResponse = $paymentService->additionalCharge(order: $order, request: $requestData);
        $orderService->addExtraCharge(
            order: $order,
            user: auth()->user(),
            data: $request->all(),
            paymentResponse: $extraChargeResponse,
        );

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

        return new OrderPaymentResource($orderPayment);
    }
}
