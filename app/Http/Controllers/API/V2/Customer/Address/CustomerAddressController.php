<?php

namespace App\Http\Controllers\API\V2\Customer\Address;

use App\Http\Controllers\API\V1\Customer\Address\CustomerAddressController as V1CustomerAddressController;
use App\Http\Requests\API\V2\Customer\Address\CreateCustomerAddressRequest;
use App\Http\Requests\API\V2\Customer\Address\UpdateCustomerAddressRequest;
use App\Http\Resources\API\V2\Customer\Address\CustomerAddressResource;
use App\Models\CustomerAddress;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerAddressController extends V1CustomerAddressController
{
    public function store(CreateCustomerAddressRequest $request): CustomerAddressResource
    {
        return new CustomerAddressResource($this->customerAddressService->create($request->validated()));
    }

    public function update(CustomerAddress $address, UpdateCustomerAddressRequest $request): CustomerAddressResource
    {
        return new CustomerAddressResource($this->customerAddressService->update($address, $request->validated()));
    }

    public function destroy(CustomerAddress $address): JsonResponse
    {
        $address->delete();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
