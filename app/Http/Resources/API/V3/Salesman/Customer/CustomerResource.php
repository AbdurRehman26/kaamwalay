<?php

namespace App\Http\Resources\API\V3\Salesman\Customer;

use App\Http\Resources\API\V2\Salesman\Customer\CustomerResource as V2CustomerResource;
use App\Models\User;

/**
 * @mixin User
 * @property mixed $referrer
 */
class CustomerResource extends V2CustomerResource
{
}
