<?php

namespace App\Services\Admin\Salesman;

use App\Exceptions\API\Admin\Salesman\UserIsNotSalesmanException;
use App\Models\SalesmanCommissionPayment;
use App\Models\User;
use App\Services\Order\Validators\SalesmanCommissionAmountValidator;
use App\Services\Salesman\SalesmanDashboardService;
use Illuminate\Database\Eloquent\Collection;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class SalesmanCommissionPaymentService
{
    public function getCommissionPayments(User $salesman): Collection
    {
        return QueryBuilder::for(SalesmanCommissionPayment::class)
            ->forSalesman($salesman)
            ->defaultSort('-created_at')
            ->allowedSorts([
                'created_at',
            ])
            ->get();
    }

    public function payCommission(User $salesman, User $addedBy, array $data): SalesmanCommissionPayment
    {
        throw_unless($salesman->isSalesman(), UserIsNotSalesmanException::class);

        SalesmanCommissionAmountValidator::validate($salesman, $data['amount']);

        $commissionPayment = new SalesmanCommissionPayment($data);
        $commissionPayment->salesman()->associate($salesman);
        $commissionPayment->addedBy()->associate($addedBy);
        $commissionPayment->save();

        return $commissionPayment;
    }
}
