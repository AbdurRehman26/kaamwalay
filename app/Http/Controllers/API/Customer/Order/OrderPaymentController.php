<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Exceptions\API\Customer\Order\UnpayableOrder;
use App\Exceptions\Services\Payment\UnverifiedPayment;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderPaymentController extends Controller
{
    public function pay(Order $order, PaymentService $paymentService)
    {
        $this->authorize('view', $order);

        throw_unless($order->isPayable(), UnpayableOrder::class);

        $response = $paymentService->charge($order);

        if (isset($response['success']) && $response['success']) {
            $paymentService->updateOrderStatus($order);

            return new JsonResponse($response);
        }

        return new JsonResponse($response, Response::HTTP_PAYMENT_REQUIRED);
    }

    public function verify(Order $order, $paymentIntentId, PaymentService $paymentService): JsonResponse
    {
        $this->authorize('view', $order);

        throw_unless(
            $paymentService->verify($order, $paymentIntentId),
            UnverifiedPayment::class
        );

        $paymentService->updateOrderStatus($order);

        return new JsonResponse([
            'message' => 'Payment verified successfully',
        ], Response::HTTP_OK);
    }

    public function createOrder(Order $order, PaymentService $paymentService)
    {
        $response = $paymentService->createOrder($order);

        return new JsonResponse(
            $response,
            isset($response['error'])
                ? Response::HTTP_BAD_REQUEST
                : Response::HTTP_CREATED
        );
    }
}
