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
        if($value){
            $query->whereHas(
                    'user',
                    fn ($query) => $query->whereNotNull('referred_by')
            );
        } else {
            $query->whereHas(
                    'user',
                    fn ($query) => $query->whereNull('referred_by')
            );
        }
    }
}
