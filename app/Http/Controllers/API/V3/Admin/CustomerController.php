<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\Customer\UpdateCustomerDetailsRequest;
use App\Http\Resources\API\V3\Admin\Customer\CustomerCollection;
use App\Http\Resources\API\V3\Admin\Customer\CustomerResource;
use App\Models\User;
use App\Services\Admin\CustomerService;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService)
    {
    }

    public function index(): CustomerCollection
    {
        return new CustomerCollection($this->customerService->getCustomers());
    }

    public function show(User $customer): CustomerResource
    {
        $customer->load(['salesman', 'referrer', 'referredBy']);

        return new CustomerResource($customer);
    }

    public function update(UpdateCustomerDetailsRequest $request, User $user): CustomerResource
    {
        return new CustomerResource($this->customerService->updateCustomer($user, $request->validated()));
    }
}
