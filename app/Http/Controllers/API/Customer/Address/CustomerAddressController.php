<?php

namespace App\Http\Controllers\API\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Address\CustomerAddressCollection;
use App\Http\Resources\API\Customer\Address\CustomerAddressResource;
use App\Models\CustomerAddress;

class CustomerAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return CustomerAddressCollection
     */
    public function index()
    {
        $user = auth()->user();
        $addresses = CustomerAddress::forUser($user)->get();

        return new CustomerAddressCollection($addresses);
    }


    /**
     * @param $address
     * @return CustomerAddressResource
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(CustomerAddress $address)
    {
        $this->authorize('view', $address);

        return new CustomerAddressResource($address);
    }
}
