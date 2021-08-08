<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Symfony\Component\HttpFoundation\Response;

class PaymentMethodController extends Controller
{
    public function index()
    {
        /**
         * @var User $user
         */
        $user = auth()->user();

        return new JsonResponse([
            'data' => $user->paymentMethods(),
        ], Response::HTTP_OK);
    }

    public function getSetupIntent()
    {
        /**
         * @var User $user
         */
        $user = auth()->user();

        return new JsonResponse([
            'intent' => $user->createSetupIntent(['customer' => $user->stripe_id]),
        ], Response::HTTP_OK);
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
