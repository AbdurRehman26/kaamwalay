<?php

namespace App\Http\Controllers\API\V2\Admin\Salesman;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Salesman\StoreSalesmanRequest;
use App\Http\Resources\API\V2\Admin\Salesman\SalesmanCollection;
use App\Http\Resources\API\V2\Admin\Salesman\SalesmanResource;
use App\Models\User;
use App\Services\Admin\V2\Salesman\SalesmanService;
use Illuminate\Http\Request;

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

    public function store(StoreSalesmanRequest $request): SalesmanResource
    {
        return new SalesmanResource($this->salesmanService->createSalesman($request->validated()));
    }
}
