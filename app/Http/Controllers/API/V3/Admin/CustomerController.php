<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Exceptions\API\Admin\InvalidAgsDataForCustomer;
use App\Exceptions\API\Auth\AgsAuthenticationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\Customer\UpdateCustomerDetailsRequest;
use App\Http\Resources\API\V3\Admin\Customer\CustomerCollection;
use App\Http\Resources\API\V3\Admin\Customer\CustomerResource;
use App\Models\User;
use App\Services\Admin\CustomerService;
use App\Services\AGS\AgsService;
use Symfony\Component\HttpFoundation\Response;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService, protected AgsService $agsService)
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
        /** @var User $authUser */
        $authUser = auth()->user();

        throw_if(! $authUser->ags_access_token, AgsAuthenticationException::class);

        $response = $this->agsService->updateCustomerData($authUser->ags_access_token, $user->username, $request->validated());

        if (! empty($response['code'])) {
            throw_if($response['code'] === Response::HTTP_BAD_REQUEST, new InvalidAgsDataForCustomer($response['message'], Response::HTTP_UNPROCESSABLE_ENTITY));
            throw_if($response['code'] === Response::HTTP_UNAUTHORIZED, AgsAuthenticationException::class);
        }

        return new CustomerResource($this->customerService->updateCustomer($user, $request->validated()));
    }
}
