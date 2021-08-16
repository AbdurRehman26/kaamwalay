<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Order\PaymentMethod\PaymentMethodCollection;
use App\Http\Resources\API\Customer\Order\PaymentMethod\PaymentMethodResource;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Cache;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $paymentMethods = Cache::remember(
            'payment_methods',
            now()->addWeek(),
            fn() => PaymentMethod::all()
        );
        return new PaymentMethodCollection($paymentMethods);
    }

    public function show(PaymentMethod $paymentMethod)
    {
        return new PaymentMethodResource($paymentMethod);
    }
}
