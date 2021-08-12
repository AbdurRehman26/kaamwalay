<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Symfony\Component\HttpFoundation\Response;

class StripeService implements PaymentProviderServiceInterface
{
    public function createSetupIntent(): \Stripe\SetupIntent
    {
        /** @var User $user */
        $user = auth()->user();

        return $user->createSetupIntent(['customer' => $user->stripe_id]);
    }

    public function charge(Order $order)
    {
        /** @var User $user */
        $user = auth()->user();

        try {
            $response = $user->charge(
                $order->grand_total,
                $order->orderPayment->payment_provider_reference_id
            );

            return new JsonResponse([
                'success' => true,
                'data' => $response,
            ], Response::HTTP_CREATED);
        } catch (IncompletePayment $exception) {
            return new JsonResponse([
                'payment_intent' => $exception->payment,
            ], Response::HTTP_PAYMENT_REQUIRED);
        }
    }
}
