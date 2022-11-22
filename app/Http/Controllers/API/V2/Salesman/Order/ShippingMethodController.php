<?php

namespace App\Http\Controllers\API\V2\Salesman\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\Order\ShippingMethod\ShippingMethodCollection;
use App\Http\Resources\API\V2\Admin\Order\ShippingMethod\ShippingMethodResource;
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
