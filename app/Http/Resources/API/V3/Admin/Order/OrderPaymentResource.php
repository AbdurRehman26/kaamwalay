<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V2\Admin\Order\OrderPaymentResource as V2OrderPaymentResource;
use App\Models\OrderPayment;

/**
 * @mixin OrderPayment
 */
class OrderPaymentResource extends V2OrderPaymentResource
{

}
