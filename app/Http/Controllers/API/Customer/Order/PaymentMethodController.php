<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Order\PaymentMethod\PaymentMethodCollection;
use App\Http\Resources\API\Customer\Order\PaymentMethod\PaymentMethodResource;
use App\Models\PaymentMethod;

class PaymentMethodController extends Controller
{
    public function index()
    {
        return new PaymentMethodCollection(PaymentMethod::all());
    }

    public function show(PaymentMethod $paymentMethod)
    {
        return new PaymentMethodResource($paymentMethod);
    }
}
