<?php

namespace App\Http\Controllers\API\V1\Admin\Order;

use App\Exceptions\API\Admin\Order\FailedRefund;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\RefundOrderRequest;
use App\Http\Resources\API\V1\Admin\Order\OrderPaymentResource;
use App\Models\Order;
use App\Services\Admin\OrderService;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderRefundController extends Controller
{
    /**
     * @throws FailedRefund
    */
    public function __invoke(
        RefundOrderRequest $request,
        Order $order,
        PaymentService $paymentService,
        OrderService $orderService,
    ): JsonResponse {
        $response = $paymentService->refund(order: $order, request: $request->all());
        $orderService->processRefund(
            order: $order,
            user: auth()->user(),
            data: $request->all(),
            refundResponse: $response
        );

        return (new OrderPaymentResource($order->lastOrderPayment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
