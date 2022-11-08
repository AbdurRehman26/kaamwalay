<?php

namespace App\Http\Controllers\API\V2\Admin;

use App\Exceptions\API\Admin\Customer\AccessEmailCanNotBeSent;
use App\Exceptions\API\Admin\Customer\SalesmanCanNotBeAssigned;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Customer\ListCustomerRequest;
use App\Http\Requests\API\V2\Admin\Customer\StoreCustomerRequest;
use App\Http\Resources\API\V2\Admin\Customer\CustomerCollection;
use App\Http\Resources\API\V2\Admin\Customer\CustomerResource;
use App\Models\User;
use App\Services\Admin\CustomerService;
use Illuminate\Http\JsonResponse;
use Throwable;

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
        throw_unless($salesman->id !== $user->id && $salesman->isSalesman() && $user->assignSalesman($salesman), SalesmanCanNotBeAssigned::class);

        return new JsonResponse(
            [
                'success' => true,
                'message' => 'Salesman has been assigned to the user.',
            ]
        );
    }
}
