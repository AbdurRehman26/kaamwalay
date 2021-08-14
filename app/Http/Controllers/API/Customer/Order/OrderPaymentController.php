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
    public function __construct(protected PaymentService $paymentService)
    {
    }

    public function pay(Order $order)
    {
        $this->authorize('view', $order);

        throw_unless($order->isPayable(), UnpayableOrder::class);

        $response = $this->paymentService->charge($order);

        if (isset($response['success']) && $response['success']) {
            $this->paymentService->updateOrderStatus($order);

            return new JsonResponse($response);
        }

        return new JsonResponse($response, Response::HTTP_PAYMENT_REQUIRED);
    }

    public function verify(Order $order, $paymentIntentId): JsonResponse
    {
        $this->authorize('view', $order);

        throw_unless(
            $this->paymentService->verify($order, $paymentIntentId),
            UnverifiedPayment::class
        );

        $this->paymentService->updateOrderStatus($order);

        return new JsonResponse([
            'message' => 'Payment verified successfully',
        ], Response::HTTP_OK);
    }

    public function createOrder(Order $order)
    {
        $response = $this->paymentService->createOrder($order);

        return new JsonResponse(
            $response,
            isset($response['error'])
                ? Response::HTTP_BAD_REQUEST
                : Response::HTTP_CREATED
        );
    }
}
