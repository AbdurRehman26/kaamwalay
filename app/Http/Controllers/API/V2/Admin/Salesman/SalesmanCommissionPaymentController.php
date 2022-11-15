<?php

namespace App\Http\Controllers\API\V2\Admin\Salesman;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Salesman\StoreSalesmanCommissionPaymentRequest;
use App\Http\Resources\API\V2\Admin\Salesman\SalesmanCommissionPaymentCollection;
use App\Http\Resources\API\V2\Admin\Salesman\SalesmanCommissionPaymentResource;
use App\Models\User;
use App\Services\Admin\Salesman\SalesmanCommissionPaymentService;

class SalesmanCommissionPaymentController extends Controller
{
    public function __construct(protected SalesmanCommissionPaymentService $salesmanCommissionPaymentService)
    {
    }

    public function index(User $salesman): SalesmanCommissionPaymentCollection
    {
        $commissionPayments = $this->salesmanCommissionPaymentService->getCommissionPayments($salesman);

        return new SalesmanCommissionPaymentCollection($commissionPayments);
    }

    public function store(
        User $salesman,
        StoreSalesmanCommissionPaymentRequest $request
    ): SalesmanCommissionPaymentResource {
        $salesmanCommissionPayment = $this->salesmanCommissionPaymentService->payCommission(
            $salesman,
            auth()->user(),
            $request->validated()
        );

        return new SalesmanCommissionPaymentResource($salesmanCommissionPayment);
    }
}
