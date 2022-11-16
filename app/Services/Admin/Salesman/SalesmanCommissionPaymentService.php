<?php

namespace App\Services\Admin\Salesman;

use App\Exceptions\API\Admin\Salesman\UserIsNotSalesmanException;
use App\Models\SalesmanCommissionPayment;
use App\Models\User;
use App\Services\Order\Validators\SalesmanCommissionAmountValidator;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class SalesmanCommissionPaymentService
{
    protected const PER_PAGE = 10;

    public function getCommissionPayments(User $salesman): LengthAwarePaginator
    {
        return QueryBuilder::for(SalesmanCommissionPayment::class)
            ->defaultSort('-created_at')
            ->allowedSorts([
                'created_at',
            ])
            ->where('salesman_id', $salesman->id)
            ->with('salesman', 'addedBy')
            ->paginate(request('per_page', self::PER_PAGE));
    }

    /**
     * @throws Throwable
     */
    public function payCommission(User $salesman, User $addedBy, array $data): SalesmanCommissionPayment
    {
        SalesmanCommissionAmountValidator::validate($salesman, $data['amount']);

        $commissionPayment = new SalesmanCommissionPayment($data);
        $commissionPayment->salesman()->associate($salesman);
        $commissionPayment->addedBy()->associate($addedBy);
        $commissionPayment->save();

        return $commissionPayment;
    }
}
