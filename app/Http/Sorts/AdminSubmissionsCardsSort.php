<?php

namespace App\Http\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminSubmissionsCardsSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->withSum('orderItems', 'quantity')->orderBy('order_items_sum_quantity', $direction);
    }
}
