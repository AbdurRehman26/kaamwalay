<?php

namespace App\Http\Controllers\API\Customer\Address;

use App\Models\CustomerAddress;
use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Address\CustomerAddressResource;
use App\Http\Resources\API\Customer\Address\CustomerAddressCollection;

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
