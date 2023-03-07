<?php

namespace App\Http\Filters;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminOrderReferByFilter implements Filter
{
    /**
     * @param  Builder<Order>  $query
     */

    public function __invoke(Builder $query, string $value, string $property): void
    {
        $query->whereHas('user', function ($query) use ($value) {
            $operand = ! empty($value) ? '!=' : '=';
            $query->where('referred_by', $operand, null);
        });
    }
}
