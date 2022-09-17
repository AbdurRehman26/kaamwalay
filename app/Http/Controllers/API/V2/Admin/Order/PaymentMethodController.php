<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\Order\PaymentMethod\PaymentMethodCollection;
use App\Http\Resources\API\V2\Admin\Order\PaymentMethod\PaymentMethodResource;
use App\Models\PaymentMethod;

class PaymentMethodController extends Controller
{
    public function index(): PaymentMethodCollection
    {
        $paymentMethods = PaymentMethod::enabled()->visible()->get();

        return new PaymentMethodCollection($paymentMethods);
    }

    public function show(PaymentMethod $paymentMethod): PaymentMethodResource
    {
        return new PaymentMethodResource($paymentMethod);
    }
}
