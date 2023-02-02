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
        if (str_word_count($value) === 2) {
            $fullName = explode(' ', $value);
            $query->where('first_name', $fullName[0])->where('last_name', $fullName[1]);
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
