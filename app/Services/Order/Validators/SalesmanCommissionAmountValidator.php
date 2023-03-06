<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Admin\Salesman\InvalidSalesmanCommissionAmountException;
use App\Models\User;
use App\Services\Salesman\SalesmanDashboardService;

class SalesmanCommissionAmountValidator
{
    public static function validate(User $salesman, float $amount): void
    {
        $salesmanStatsService = resolve(SalesmanDashboardService::class);

        throw_if(
            $amount > (
                $salesmanStatsService->getCommissionsEarned($salesman) - $salesman->receivedCommissionTotal()
            ),
            InvalidSalesmanCommissionAmountException::class
        );
    }
}
