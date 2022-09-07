<?php

namespace App\Http\Sorts;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminCustomerSubmissionsSort implements Sort
{
    /**
     * @param  Builder<User>  $query
     * @param  bool  $descending
     * @param  string  $property
     * @return void
     */
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->withCount(['orders' => function (Builder $q) {
            $q->where('payment_status', OrderPaymentStatusEnum::PAID);
        }])->orderBy('orders_count', $direction);
    }
}
