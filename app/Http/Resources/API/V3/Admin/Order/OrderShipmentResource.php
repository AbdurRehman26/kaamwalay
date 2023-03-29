<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Models\OrderShipment;
use App\Http\Resources\API\V2\Admin\Order\OrderShipmentResource as V2OrderShipmentResource;

/** @mixin OrderShipment */
class OrderShipmentResource extends V2OrderShipmentResource
{
}
