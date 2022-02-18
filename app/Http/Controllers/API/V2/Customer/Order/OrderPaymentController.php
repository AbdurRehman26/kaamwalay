<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderNotPayable;
use App\Exceptions\Services\Payment\PaymentNotVerified;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payment\V2\PaymentService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class OrderPaymentController extends Controller
{
    public function __construct(protected PaymentService $paymentService)
    {
    }

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

    public function verify(Order $order, string $paymentIntentId): JsonResponse
    {
        $this->authorize('view', $order);

        throw_unless(
            $this->paymentService->verify($order, $paymentIntentId),
            PaymentNotVerified::class
        );

        return new JsonResponse([
            'message' => 'Payment verified successfully',
        ], Response::HTTP_OK);
    }
}
