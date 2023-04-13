<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderLabel;

use App\Http\Resources\API\V2\Admin\Order\OrderLabel\OrderLabelResource as V2OrderLabelResource;
use App\Models\OrderLabel;

/** @mixin OrderLabel */
class OrderLabelResource extends V2OrderLabelResource
{
}
