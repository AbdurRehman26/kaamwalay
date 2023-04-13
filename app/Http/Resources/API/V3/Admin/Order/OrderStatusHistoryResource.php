<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V2\Admin\Order\OrderStatusHistoryResource as V2OrderStatusHistoryResource;
use App\Models\OrderStatusHistory;

/**
 * @mixin OrderStatusHistory
 */
class OrderStatusHistoryResource extends V2OrderStatusHistoryResource
{
}
