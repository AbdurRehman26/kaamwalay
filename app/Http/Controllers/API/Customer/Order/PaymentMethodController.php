<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return response()->json([
            'data' => $user->paymentMethods()
        ]);
    }

    public function getSetupIntent()
    {
        $user = auth()->user();

        return response()->json([
            'intent' => $user->createSetupIntent(),
        ], Response::HTTP_OK);
    }
}
