<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminOrderReferByFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        $query->whereHas('user', function ($query) use ($value) {
            $operand = ! empty($value) ? '!=' : '=';
            $query->where('referred_by', $operand, null);
        });
    }
}
