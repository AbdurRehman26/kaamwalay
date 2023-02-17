<?php

namespace App\Http\Filters;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminOrderReferByFilter implements Filter
{
    /**
     * @param  Builder<Order>  $query
     * @param  string $value
     * @param  string  $property
     * @return void
     */

    public function __invoke(Builder $query, $value, string $property)
    {

        $query->whereHas('user', function ($query) use ($value) {
            $operand = !empty($value) ? '!=' : '=';
            $query->where('referred_by', $operand, NULL);
            });
    }
}
