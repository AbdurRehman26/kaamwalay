<?php

namespace App\Http\Controllers\API\V1\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodCollection;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Models\ShippingMethod;

class ShippingMethodController extends Controller
{
    public function index(): ShippingMethodCollection
    {
        return new ShippingMethodCollection(ShippingMethod::all());
    }

    public function show(ShippingMethod $shippingMethod): ShippingMethodResource
    {
        return new ShippingMethodResource($shippingMethod);
    }
}
