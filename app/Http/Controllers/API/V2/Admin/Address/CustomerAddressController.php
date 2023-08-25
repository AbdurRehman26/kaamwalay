<?php

namespace App\Http\Controllers\API\V2\Admin\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\Customer\Address\CustomerAddressCollection;
use App\Models\CustomerAddress;
use App\Models\User;

class CustomerAddressController extends Controller
{
    public function getCustomerAddresses(User $user): CustomerAddressCollection
    {
        $addresses = CustomerAddress::forUser($user)->get();

        return new CustomerAddressCollection($addresses);
    }
}
