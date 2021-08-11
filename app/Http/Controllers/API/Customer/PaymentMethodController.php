<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Payment\StripeService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PaymentMethodController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = auth()->user();

        return new JsonResponse([
            'data' => $user->paymentMethods(),
        ], Response::HTTP_OK);
    }

    public function createSetupIntent(StripeService $stripeService): JsonResponse
    {
        return new JsonResponse([
            'intent' => $stripeService->createSetupIntent(),
        ], Response::HTTP_OK);
    }
}
