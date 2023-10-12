<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Exceptions\API\Customer\Order\OrderNotPayable;
use App\Exceptions\Services\Payment\PaymentNotVerified;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Order\StoreOrderPaymentRequest;
use App\Models\Order;
use App\Services\Order\V2\OrderPaymentService;
use App\Services\Payment\V2\PaymentService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderPaymentController extends Controller
{
    public function __construct(protected PaymentService $paymentService)
    {
    }

    /**
     * @throws Throwable
     */
    public function process(
        StoreOrderPaymentRequest $request,
        Order $order,
        OrderPaymentService $orderPaymentService
    ): JsonResponse {
        throw_if(! empty($order->coupon) && ! $order->coupon->isActive(), ValidationException::withMessages([
            'message' => 'Coupon is either expired or invalid.',
        ]));

        throw_unless($order->isPayable('v2'), OrderNotPayable::class);

        try {
            DB::beginTransaction();

            $orderPaymentService->createPayments($order, $request->validated());

            $response = $this->paymentService->charge($order, $request->all());

            DB::commit();

            if (! empty($response['data'])) {
                return new JsonResponse($response);
            }
        } catch (Exception $e) {
            DB::rollBack();

            return new JsonResponse(
                [
                    'message' => $e->getMessage(),
                ],
                Response::HTTP_PAYMENT_REQUIRED
            );
        }

        DB::rollBack();

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

    /**
     * @throws Throwable
     */
    public function createPaymentIntent(
        StoreOrderPaymentRequest $request,
        Order $order,
        OrderPaymentService $orderPaymentService
    ): JsonResponse {

        throw_if(! empty($order->coupon) && ! $order->coupon->isActive(), ValidationException::withMessages([
            'message' => 'Coupon is either expired or invalid.',
        ]));

        throw_if(empty($order->canBePaidWithAffirm()), ValidationException::withMessages([
            'message' => 'Minimum order amount for affirm payment method is '.Order::AFFIRM_MIN_AMOUNT,
        ]));

        throw_unless($order->isPayable('v2'), OrderNotPayable::class);

        try {
            DB::beginTransaction();

            $orderPaymentService->createPayments($order, $request->validated());

            $response = $this->paymentService->createPaymentIntent($order, $request->all());

            DB::commit();

            return new JsonResponse(['intent' => $response['payment_provider_reference_id']]);

        } catch (Exception $e) {

            DB::rollBack();

            return new JsonResponse(
                [
                    'message' => $e->getMessage(),
                ],
                Response::HTTP_PAYMENT_REQUIRED
            );
        }
    }
}
