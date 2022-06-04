<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Http\Controllers\API\V1\Customer\PaymentCardController as V1PaymentCardController;
use App\Models\User;
use App\Services\Payment\V2\Providers\StripeService;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PaymentCardController extends V1PaymentCardController
{
    public function destroy(string $paymentMethodId): JsonResponse
    {
        try {
            /** @var User $user */
            $user = auth()->user();
            resolve(StripeService::class)->deleteUserPaymentMethod($user, $paymentMethodId);

            return new JsonResponse([], Response::HTTP_NO_CONTENT);
        }catch (Exception $exception){

            return new JsonResponse([
                'error' => $exception->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }
}
