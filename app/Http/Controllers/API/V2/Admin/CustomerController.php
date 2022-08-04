<?php

namespace App\Http\Controllers\API\V2\Admin;

use App\Exceptions\API\Admin\Customer\AccessEmailCanNotBeSent;
use App\Http\Controllers\API\V1\Admin\CustomerController as V1CustomerController;
use App\Http\Requests\API\V2\Admin\Customer\StoreCustomerRequest;
use App\Http\Resources\API\V2\Admin\Customer\CustomerResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class CustomerController extends V1CustomerController
{
    public function show(User $customer): CustomerResource
    {
        return new CustomerResource($customer);
    }

    public function store(StoreCustomerRequest $request): CustomerResource
    {
        return new CustomerResource($this->customerService->createCustomer($request->validated()));
    }

    /**
     * @throws AccessEmailCanNotBeSent
     */
    public function sendAccessEmail(User $user): JsonResponse
    {
        if (! (auth()->user()->isAdmin() && ! $user->last_login_at)) {
            throw new AccessEmailCanNotBeSent;
        }

        $this->customerService->sendAccessEmailToCreatedCustomer($user);

        return new JsonResponse(
            [
                'success' => true,
                'message' => 'Access email has been sent.',
            ]
        );
    }
}
