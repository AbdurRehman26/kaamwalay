<?php

namespace App\Http\Sorts;

use App\Enums\Order\OrderPaymentStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminCustomerCardsSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->withSum(['orderItems' => function (Builder $q) {
            $q->where('orders.payment_status', OrderPaymentStatusEnum::PAID);
        }], 'quantity')
        ->orderBy('order_items_sum_quantity', $direction);
    }
}
