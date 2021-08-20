<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Payment\Providers\StripeService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PaymentCardController extends Controller
{
    public function index(StripeService $stripeService): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        return new JsonResponse([
            'data' => $stripeService->getUserPaymentMethods($user),
        ], Response::HTTP_OK);
    }

    public function createSetupIntent(StripeService $stripeService): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        return new JsonResponse([
            'intent' => $stripeService->createSetupIntent($user),
        ], Response::HTTP_OK);
    }
}
