<?php

namespace App\Http\Controllers\API\V1\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Customer\Address\CustomerAddressCollection;
use App\Http\Resources\API\V1\Customer\Address\CustomerAddressResource;
use App\Models\CustomerAddress;

class CustomerAddressController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(CustomerAddress::class, 'address');
    }

    public function index(): CustomerAddressCollection
    {
        $user = auth()->user();
        $addresses = CustomerAddress::forUser($user)->get();

        return new CustomerAddressCollection($addresses);
    }

    public function show(CustomerAddress $address): CustomerAddressResource
    {
        return new CustomerAddressResource($address);
    }
}
