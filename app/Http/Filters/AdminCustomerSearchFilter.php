<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCustomerSearchFilter implements Filter
{
    /**
     * @param string $value
     */
    public function __invoke(Builder $query, $value, string $property): void
    {
        // If searching for both first and last name together, search exact
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
                    'customer_number',
                ],
                $value
            );
        }
    }
}
