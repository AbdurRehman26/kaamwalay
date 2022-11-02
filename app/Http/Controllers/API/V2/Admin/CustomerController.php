<?php

namespace App\Http\Controllers\API\V2\Admin;

use App\Exceptions\API\Admin\Customer\AccessEmailCanNotBeSent;
use App\Exceptions\API\Admin\Customer\SalesmanCanNotBeAssigned;
use App\Http\Controllers\API\V1\Admin\CustomerController as V1CustomerController;
use App\Http\Requests\API\V2\Admin\Customer\StoreCustomerRequest;
use App\Http\Resources\API\V2\Admin\Customer\CustomerResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Throwable;

class CustomerController extends V1CustomerController
{
    public function show(User $customer): CustomerResource
    {
        $customer->load('salesman');

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

    /**
     * @throws Throwable
     */
    public function assignSalesman(User $user, User $salesman): JsonResponse
    {
        throw_unless($salesman->isSalesman() && $user->assignSalesman($salesman), SalesmanCanNotBeAssigned::class);

        return new JsonResponse(
            [
                'success' => true,
                'message' => 'Salesman has been assigned to the user.',
            ]
        );
    }
}
