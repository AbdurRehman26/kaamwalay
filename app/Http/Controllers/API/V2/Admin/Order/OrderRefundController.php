<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\Order\FailedRefund;
use App\Exceptions\API\Admin\Order\UnprocessableWalletRefundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Order\RefundOrderRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderPaymentResource;
use App\Models\Order;
use App\Services\Admin\V2\OrderService;
use App\Services\Payment\V2\PaymentService;
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
        throw_if(
            ! $order->isPaid() && $request->input('add_to_wallet') === true,
            UnprocessableWalletRefundException::class
        );

        $response = $paymentService->refund(
            order: $order,
            request: $request->all(),
            user: $request->user(),
            returnInWallet: $request->input('add_to_wallet')
        );
        $orderService->processRefund(
            order: $order,
            user: auth()->user(),
            data: $request->all(),
            refundResponse: $response,
            refundedInWallet: $request->input('add_to_wallet')
        );

        return (new OrderPaymentResource($order->lastOrderPayment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
