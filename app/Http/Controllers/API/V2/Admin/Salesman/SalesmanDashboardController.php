<?php

namespace App\Http\Controllers\API\V2\Admin\Salesman;

use App\Http\Requests\API\V2\Admin\Salesman\SalesmanDashboardStatsRequest;
use App\Services\Salesman\SalesmanDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalesmanDashboardController
{
    protected SalesmanDashboardService $salesmanDashboardService;

    public function __construct(SalesmanDashboardService $salesmanDashboardService)
    {
        $this->salesmanDashboardService = $salesmanDashboardService;
    }

    public function getSales(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->salesmanDashboardService->getSales($request->user(), $request->all()),
        ]);
    }

    public function getCommissionsEarned(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->salesmanDashboardService->getCommissionsEarned($request->user(), $request->all()),
        ]);
    }
}
