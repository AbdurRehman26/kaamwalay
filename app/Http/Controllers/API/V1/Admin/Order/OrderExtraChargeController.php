<?php

namespace App\Http\Controllers\API\V1\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Order\AddExtraChargeRequest;
use App\Http\Resources\API\V1\Admin\Order\OrderPaymentResource;
use App\Models\Order;
use App\Services\Admin\OrderService;
use App\Services\Payment\V1\PaymentService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderExtraChargeController extends Controller
{
    /**
     * @throws Throwable
    */
    public function __invoke(
        AddExtraChargeRequest $request,
        Order $order,
        OrderService $orderService,
        PaymentService $paymentService,
    ): JsonResponse {
        $response = $paymentService->additionalCharge(order: $order, request: $request->all());
        $orderService->addExtraCharge(
            order: $order,
            user: auth()->user(),
            data: $request->all(),
            paymentResponse: $response
        );

        return (new OrderPaymentResource($order->lastOrderPayment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
