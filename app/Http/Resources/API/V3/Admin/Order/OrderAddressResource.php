<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V3\Shared\Country\CountryResource;
use App\Models\OrderAddress;
use App\Http\Resources\API\V2\Admin\Order\OrderAddressResource as V2OrderAddressResource;

/** @mixin OrderAddress */
class OrderAddressResource extends V2OrderAddressResource
{
}
