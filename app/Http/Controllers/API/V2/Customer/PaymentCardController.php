<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Http\Controllers\API\V1\Customer\PaymentCardController as V1PaymentCardController;
use App\Models\User;
use App\Services\Payment\V2\Providers\StripeService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PaymentCardController extends V1PaymentCardController
{
    public function destroy($paymentMethodId): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        return new JsonResponse([
            'data' => resolve(StripeService::class)->deleteUserPaymentMethod($user, $paymentMethodId),
        ], Response::HTTP_OK);
    }
}
