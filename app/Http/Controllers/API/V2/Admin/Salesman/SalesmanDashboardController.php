<?php

namespace App\Http\Controllers\API\V2\Admin\Salesman;

use App\Http\Requests\API\V2\Admin\Salesman\SalesmanDashboardStatsRequest;
use App\Services\Admin\V2\Salesman\SalesmanService;
use Illuminate\Http\JsonResponse;

class SalesmanDashboardController
{
    protected SalesmanService $salesmanService;

    public function __construct(SalesmanService $salesmanService)
    {
        $this->salesmanService = $salesmanService;
    }

    public function getSales(SalesmanDashboardStatsRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->salesmanService->getSales($request->validated())
        ]);
    }

    public function getCommissionsEarned(SalesmanDashboardStatsRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->salesmanService->getCommissionsEarned($request->validated())
        ]);
    }
}
