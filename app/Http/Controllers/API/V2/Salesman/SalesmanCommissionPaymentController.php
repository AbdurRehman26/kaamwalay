<?php

namespace App\Http\Controllers\API\V2\Salesman;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Salesman\SalesmanCommissionPaymentCollection;
use App\Services\Salesman\SalesmanCommissionPaymentService;

class SalesmanCommissionPaymentController extends Controller
{
    public function __construct(protected SalesmanCommissionPaymentService $salesmanCommissionPaymentService)
    {
    }

    public function index(): SalesmanCommissionPaymentCollection
    {
        $commissionPayments = $this->salesmanCommissionPaymentService->getCommissionPayments(auth()->user());

        return new SalesmanCommissionPaymentCollection($commissionPayments);
    }
}
