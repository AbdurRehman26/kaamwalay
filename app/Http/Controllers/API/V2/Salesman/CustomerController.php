<?php

namespace App\Http\Controllers\API\V2\Salesman;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Salesman\Customer\ListCustomerRequest;
use App\Http\Requests\API\V2\Salesman\Customer\StoreCustomerRequest;
use App\Http\Resources\API\V2\Salesman\Customer\CustomerCollection;
use App\Http\Resources\API\V2\Salesman\Customer\CustomerResource;
use App\Models\User;
use App\Services\Salesman\V2\CustomerService;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService)
    {
    }

    public function index(ListCustomerRequest $request): CustomerCollection
    {
        return new CustomerCollection($this->customerService->getCustomers());
    }

    public function show(User $customer): CustomerResource
    {
        $customer->load('salesman');

        return new CustomerResource($customer);
    }

    public function store(StoreCustomerRequest $request): CustomerResource
    {
        return new CustomerResource($this->customerService->createCustomer($request->validated()));
    }
}
