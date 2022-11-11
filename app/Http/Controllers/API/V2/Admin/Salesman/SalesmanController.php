<?php

namespace App\Http\Controllers\API\V2\Admin\Salesman;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Salesman\AssignSalesmanRoleToUserRequest;
use App\Http\Requests\API\V2\Admin\Salesman\SetActiveRequest;
use App\Http\Requests\API\V2\Admin\Salesman\StoreSalesmanRequest;
use App\Http\Requests\API\V2\Admin\Salesman\UpdateSalesmanRequest;
use App\Http\Resources\API\V2\Admin\Salesman\SalesmanCollection;
use App\Http\Resources\API\V2\Admin\Salesman\SalesmanResource;
use App\Models\User;
use App\Services\Admin\V2\Salesman\SalesmanService;
use Illuminate\Http\Request;
use Throwable;

class SalesmanController extends Controller
{
    public function __construct(protected SalesmanService $salesmanService)
    {
    }

    public function index(Request $request): SalesmanCollection
    {
        return new SalesmanCollection($this->salesmanService->getSalesmen());
    }

    public function show(User $salesman): SalesmanResource
    {
        return new SalesmanResource($salesman);
    }

    /**
     * @throws Throwable
     */
    public function store(StoreSalesmanRequest $request): SalesmanResource
    {
        return new SalesmanResource($this->salesmanService->createSalesman($request->validated()));
    }

    /**
     * @throws Throwable
     */
    public function update(UpdateSalesmanRequest $request, User $salesman): SalesmanResource
    {
        return new SalesmanResource($this->salesmanService->updateSalesman($salesman, $request->validated()));
    }

    /**
     * @throws Throwable
     */
    public function assignSalesmanRoleToUser(AssignSalesmanRoleToUserRequest $request, User $user): SalesmanResource
    {
        return new SalesmanResource($this->salesmanService->assignSalesmanRoleToUser($user, $request->validated()));
    }

    /**
     * @throws Throwable
     */
    public function removeSalesmanRoleFromUser(Request $request, User $user): SalesmanResource
    {
        return new SalesmanResource($this->salesmanService->removeSalesmanRoleFromUser($user));
    }

    /**
     * @throws Throwable
     */
    public function setActive(SetActiveRequest $request, User $user): SalesmanResource
    {
        return new SalesmanResource($this->salesmanService->setActive($user, $request->validated()));
    }
}
