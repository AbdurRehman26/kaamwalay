<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Admin\Customer\CustomerCollection;
use App\Services\Admin\CustomerService;

class CustomerController extends Controller
{
    public function __construct(private CustomerService $customerService)
    {
    }

    public function index(): CustomerCollection
    {
        $coupons = $this->customerService->getCustomers();

        return new CustomerCollection($coupons);
    }
}
