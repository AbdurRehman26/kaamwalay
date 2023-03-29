<?php

namespace App\Http\Resources\API\V3\Admin\Order\ShippingMethod;

use App\Models\ShippingMethod;
use App\Http\Resources\API\V2\Admin\Order\ShippingMethod\ShippingMethodResource as V2ShippingMethodResource;

/** @mixin ShippingMethod */
class ShippingMethodResource extends V2ShippingMethodResource
{
}
