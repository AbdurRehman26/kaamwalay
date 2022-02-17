<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderNotPayable;
use App\Http\Controllers\API\V1\Customer\Order\OrderPaymentController as V1OrderPaymentController;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class OrderPaymentController extends V1OrderPaymentController
{
    public function charge(Request $request, Order $order): JsonResponse
    {
        $this->authorize('view', $order);

        try {
            throw_if(! empty($order->coupon) && ! $order->coupon->isActive(), ValidationException::withMessages([
                'message' => 'Coupon is either expired or invalid.',
            ]));

            throw_unless($order->isPayable('v2'), OrderNotPayable::class);

            $response = $this->paymentService->charge($order, $request->all());

            if (! empty($response['data'])) {
                return new JsonResponse($response);
            }
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'message' => $e->getMessage(),
                ],
                Response::HTTP_PAYMENT_REQUIRED
            );
        }

        return new JsonResponse(
            $response,
            Response::HTTP_PAYMENT_REQUIRED
        );
    }
}
