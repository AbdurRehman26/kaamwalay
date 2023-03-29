<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V2\Admin\Order\OrderAddressResource as V2OrderAddressResource;
use App\Models\OrderAddress;

/** @mixin OrderAddress */
class OrderAddressResource extends V2OrderAddressResource
{
}
