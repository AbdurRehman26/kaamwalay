<?php

namespace App\Http\Resources\API\V3\Customer\Order;

use App\Http\Resources\API\V2\Customer\Order\OrderCreateResource as V2OrderCreateResource;
use App\Models\Order;

/** @mixin Order */
class OrderCreateResource extends V2OrderCreateResource
{
    //
}
