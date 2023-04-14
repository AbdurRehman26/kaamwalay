<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V2\Admin\Order\OrderCustomerShipmentResource as V2OrderCustomerShipmentResource;
use App\Models\OrderCustomerShipment;

/** @mixin OrderCustomerShipment */
class OrderCustomerShipmentResource extends V2OrderCustomerShipmentResource
{
}
