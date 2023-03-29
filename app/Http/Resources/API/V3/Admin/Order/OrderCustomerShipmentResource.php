<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Models\OrderCustomerShipment;
use App\Http\Resources\API\V2\Admin\Order\OrderCustomerShipmentResource as V2OrderCustomerShipmentResource;

/** @mixin OrderCustomerShipment */
class OrderCustomerShipmentResource extends V2OrderCustomerShipmentResource
{
}
