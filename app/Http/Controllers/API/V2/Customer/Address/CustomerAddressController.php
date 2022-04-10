<?php

namespace App\Http\Controllers\API\V2\Customer\Address;

use App\Http\Controllers\API\V1\Customer\Address\CustomerAddressController as V1CustomerAddressController;
use App\Http\Requests\API\V2\Customer\Addresses\StoreCustomerAddressRequest;
use App\Http\Resources\API\V2\Customer\Address\CustomerAddressResource;
use App\Models\CustomerAddress;

class CustomerAddressController extends V1CustomerAddressController
{
    public function store(StoreCustomerAddressRequest $request): CustomerAddressResource
    {
        $customerAddress = new CustomerAddress($request->validated());

        $request->user()->customerAddresses()->save($customerAddress);

        return new CustomerAddressResource($customerAddress);
    }
}
