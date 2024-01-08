<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Customer\ListCustomerRequest;
use App\Http\Resources\API\V3\Customer\CustomerResource;
use App\Services\CustomerService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService)
    {
    }

    public function index(ListCustomerRequest $request): AnonymousResourceCollection
    {
        return CustomerResource::collection($this->customerService->getCustomers());
    }
}
