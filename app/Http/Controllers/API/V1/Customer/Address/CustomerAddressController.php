<?php

namespace App\Http\Controllers\API\V1\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Address\CreateCustomerAddressRequest;
use App\Http\Requests\API\V2\Customer\Address\UpdateCustomerAddressRequest;
use App\Http\Resources\API\V1\Customer\Address\CustomerAddressCollection;
use App\Http\Resources\API\V1\Customer\Address\CustomerAddressResource;
use App\Models\CustomerAddress;
use App\Services\CustomerAddressService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerAddressController extends Controller
{
    public function __construct(protected CustomerAddressService $customerAddressService)
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

    public function store(CreateCustomerAddressRequest $request) : CustomerAddressResource
    {
        return new CustomerAddressResource($this->customerAddressService->create($request->validated()));
    }
    
    public function update(CustomerAddress $address, UpdateCustomerAddressRequest $request) : CustomerAddressResource
    {
        return new CustomerAddressResource($this->customerAddressService->update($address, $request->validated()));
    }

    public function destroy(CustomerAddress $address) : JsonResponse
    {
        $address->delete();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
