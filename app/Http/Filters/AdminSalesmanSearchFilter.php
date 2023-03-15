<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminSalesmanSearchFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        $fullNameArray = explode(' ', $value);
        if (count($fullNameArray) === 2) {
            $query->where('first_name', $fullNameArray[0])->where('last_name', $fullNameArray[1]);
        } else {
            $query->whereLike(
                [
                    'first_name',
                    'last_name',
                    'email',
                    'phone',
                ],
                $value
            );
        }
    }
}
