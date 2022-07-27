<?php

namespace App\Http\Controllers\API\V2\Admin;

use App\Events\API\Admin\Customer\CustomerCreated;
use App\Http\Controllers\API\V1\Admin\CustomerController as V1CustomerController;
use App\Http\Requests\API\V2\Admin\Customer\StoreCustomerRequest;
use App\Http\Resources\API\V2\Admin\Customer\CustomerResource;
use App\Models\User;
use App\Services\Admin\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CustomerController extends V1CustomerController
{
    public function __construct(private CustomerService $customerService)
    {
        parent::__construct($this->customerService);
    }

    public function store(StoreCustomerRequest $request): CustomerResource
    {
        return new CustomerResource($this->customerService->createCustomer($request->validated()));
    }

    public function sendAccessEmail(User $user): JsonResponse
    {
        $this->authorize('sendAcessEmail', $user);

        CustomerCreated::dispatch($user);

        return new JsonResponse(
            [
                'success' => true,
                'message' => 'Access email has been sent.',
            ],
            Response::HTTP_ACCEPTED
        );
    }
}
