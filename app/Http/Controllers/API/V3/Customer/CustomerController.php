<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Customer\CustomerResource;
use App\Services\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        return CustomerResource::collection($this->customerService->getCustomers());
    }
}
