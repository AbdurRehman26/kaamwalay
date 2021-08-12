<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Stripe\Exception\ApiErrorException;
use Symfony\Component\HttpFoundation\Response;

class OrderPaymentController extends Controller
{
    public function pay(Order $order, PaymentService $paymentService)
    {
        $this->authorize('view', $order);

        if (! $order->isPayable()) {
            return new JsonResponse([
                'data' => [
                    'error' => 'Order is not payable',
                ],
            ], Response::HTTP_BAD_REQUEST);
        }

        return $paymentService->charge($order);
    }

    public function verify(Order $order, $paymentIntentId, PaymentService $paymentService): JsonResponse
    {
        $this->authorize('view', $order);

        return $paymentService->verify($order, $paymentIntentId);

    }
}
