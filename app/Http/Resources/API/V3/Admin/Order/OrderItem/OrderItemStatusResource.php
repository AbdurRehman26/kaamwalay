<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderItem;

use App\Http\Resources\API\V1\Admin\Order\OrderItem\OrderItemStatusResource as V1OrderItemStatusResource;
use App\Models\OrderItemStatus;

/**
 * @mixin OrderItemStatus
 */
class OrderItemStatusResource extends V1OrderItemStatusResource
{
}
