<?php

namespace App\Http\Sorts;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AdminCustomerFullNameSort implements Sort
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

        $query->orderBy('first_name', $direction)->orderBy('last_name', $direction);
    }
}
