<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Models\OrderStatusHistory;
use App\Http\Resources\API\V2\Admin\Order\OrderStatusHistoryResource as V2OrderStatusHistoryResource;
/**
 * @mixin OrderStatusHistory
 */
class OrderStatusHistoryResource extends V2OrderStatusHistoryResource
{
}
