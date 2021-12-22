<?php

namespace App\Http\Controllers\API\V1\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Payment\Providers\StripeService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PaymentCardController extends Controller
{
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        return new JsonResponse([
            'data' => resolve(StripeService::class)->getUserPaymentMethods($user),
        ], Response::HTTP_OK);
    }

    public function createSetupIntent(): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        return new JsonResponse([
            'intent' => resolve(StripeService::class)->createSetupIntent($user),
        ], Response::HTTP_OK);
    }
}
