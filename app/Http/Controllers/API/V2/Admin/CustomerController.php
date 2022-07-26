<?php

namespace App\Http\Controllers\API\V2\Admin;

use App\Http\Controllers\API\V1\Admin\CustomerController as V1CustomerController;
use App\Http\Resources\API\V2\Admin\Customer\CustomerResource;
use App\Models\User;

class CustomerController extends V1CustomerController
{
    public function show(User $customer): CustomerResource
    {
        return new CustomerResource($customer);
    }
}
