<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Customer\StoreCustomerRequest;
use App\Http\Resources\API\V3\Admin\Customer\CustomerCollection;
use App\Http\Resources\API\V3\Admin\Customer\CustomerResource;
use App\Models\User;
use App\Services\Admin\CustomerService;
use Illuminate\Http\JsonResponse;

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

    public function store(StoreCustomerRequest $request): CustomerResource
    {
        return new CustomerResource($this->customerService->createCustomer($request->validated()));
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

    /**
     * @throws Throwable
     */
    public function unAssignSalesman(User $user): JsonResponse
    {
        $user->unAssignSalesman();

        return new JsonResponse(
            [
                'success' => true,
                'message' => 'Salesman has been unassigned from the user.',
            ]
        );
    }
}
