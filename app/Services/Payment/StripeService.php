<?php

namespace App\Services\Payment;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Symfony\Component\HttpFoundation\Response;

class StripeService
{
    public function createSetupIntent(): \Stripe\SetupIntent
    {
        /** @var User $user */
        $user = auth()->user();

        return $user->createSetupIntent(['customer' => $user->stripe_id]);
    }

    // this is a test API to ensure the integration is in place and working.
    // once we have the submission API with all of its flows then this
    //part can be incorporated in that API.
    public function charge()
    {
        $this->validate(request(), [
            'payment_method_id' => ['required'],
        ]);
        /**
         * @var User $user
         */
        $user = auth()->user();

        try {
            $response = $user->charge(123, request('payment_method_id'));

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
