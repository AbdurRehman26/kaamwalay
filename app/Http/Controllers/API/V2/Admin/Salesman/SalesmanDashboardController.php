<?php

namespace App\Http\Controllers\API\V2\Admin\Salesman;

use App\Http\Requests\API\V2\Admin\Salesman\GetSalesmanStatRequest;
use App\Services\Salesman\SalesmanDashboardService;
use Illuminate\Http\JsonResponse;

class SalesmanDashboardController
{
    public function __construct(protected SalesmanDashboardService $salesmanDashboardService)
    {
    }

    public function getStat(GetSalesmanStatRequest $request): JsonResponse
    {
        return new JsonResponse([ 'data' => $this->salesmanDashboardService->getStat(auth()->user(), $request->validated())]);
    }
}
