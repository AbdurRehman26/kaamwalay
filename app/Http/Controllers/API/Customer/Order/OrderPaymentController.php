<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;

class OrderPaymentController extends Controller
{
    public function __invoke(Order $order, PaymentService $paymentService)
    {
        //@TODO Implement authorization, customer should be able to pay their own orders only

        if (! $order->isPayable()) {
            return new JsonResponse([
                'data' => [
                    'success' => false,
                    'message' => 'Order is not payable',
                ],
            ]);
        }

        return $paymentService->charge($order);
    }
}
