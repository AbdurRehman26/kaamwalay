<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V2\Admin\Order\OrderShipmentResource as V2OrderShipmentResource;
use App\Models\OrderShipment;

/** @mixin OrderShipment */
class OrderShipmentResource extends V2OrderShipmentResource
{
}
