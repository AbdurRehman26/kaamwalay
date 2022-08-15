<?php

namespace App\Http\Sorts;

use App\Enums\Order\OrderPaymentStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminSubmissionsPaymentStatusSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->select('orders.*')
            ->addSelect(DB::raw("if(payment_status = ".OrderPaymentStatusEnum::PENDING->value.", 'Pending', if(payment_status = ".OrderPaymentStatusEnum::DUE->value.", 'Payment due', 'Paid')) as payment_status_name"))
            ->orderBy('payment_status_name', $direction);
    }
}
