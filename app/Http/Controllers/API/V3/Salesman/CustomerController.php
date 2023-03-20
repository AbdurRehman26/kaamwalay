<?php

namespace App\Http\Controllers\API\V3\Salesman;

use App\Exceptions\API\Auth\AgsAuthenticationException;
use App\Exceptions\API\Salesman\Customer\CustomerDetailsCouldNotBeUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Salesman\Customer\UpdateCustomerDetailsRequest;
use App\Http\Resources\API\V3\Salesman\Customer\CustomerResource;
use App\Models\User;
use App\Services\AGS\AgsService;
use App\Services\Salesman\V3\CustomerService;
use Symfony\Component\HttpFoundation\Response;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService)
    {
    }
    public function update(UpdateCustomerDetailsRequest $request, User $user): CustomerResource
    {
        return new CustomerResource($this->customerService->updateCustomer($user, $request->validated()));
    }
}
