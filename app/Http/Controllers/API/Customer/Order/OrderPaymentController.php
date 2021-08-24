<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderNotPayable;
use App\Exceptions\Services\Payment\PaymentNotVerified;
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

        throw_unless($order->isPayable(), OrderNotPayable::class);

        $response = $this->paymentService->charge($order);

        if (! empty($response['success'])) {
            $this->paymentService->updateOrderStatus($order);

            return new JsonResponse($response);
        }

        return new JsonResponse(
            $response,
            $order->paymentMethod->code === 'stripe' ? Response::HTTP_PAYMENT_REQUIRED : Response::HTTP_CREATED
        );
    }

    public function verify(Order $order, $paymentIntentId): JsonResponse
    {
        $this->authorize('view', $order);

        throw_unless(
            $this->paymentService->verify($order, $paymentIntentId),
            PaymentNotVerified::class
        );

        $this->paymentService->updateOrderStatus($order);

        $this->paymentService->calculateAndSaveFee($order);

        return new JsonResponse([
            'message' => 'Payment verified successfully',
        ], Response::HTTP_OK);
    }
}
