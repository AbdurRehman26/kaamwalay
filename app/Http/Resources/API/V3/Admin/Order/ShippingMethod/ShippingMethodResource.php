<?php

namespace App\Http\Resources\API\V3\Admin\Order\ShippingMethod;

use App\Http\Resources\API\V2\Admin\Order\ShippingMethod\ShippingMethodResource as V2ShippingMethodResource;
use App\Models\ShippingMethod;

/** @mixin ShippingMethod */
class ShippingMethodResource extends V2ShippingMethodResource
{
}
