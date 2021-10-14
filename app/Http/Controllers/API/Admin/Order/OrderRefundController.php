<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Exceptions\API\Admin\Order\FailedRedund;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\RefundOrderRequest;
use App\Http\Resources\API\Admin\Order\OrderPaymentResource;
use App\Models\Order;
use App\Services\Admin\OrderService;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderRefundController extends Controller
{
    /**
     * @throws FailedRedund
    */
    public function __invoke(
        RefundOrderRequest $request,
        Order $order,
        PaymentService $paymentService,
        OrderService $orderService,
    ): JsonResponse {
        $response = $paymentService->refund(order: $order, request: $request->all());
        $orderService->processRefund($order, $request->all(), $response);

        return (new OrderPaymentResource($order->lastOrderPayment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
