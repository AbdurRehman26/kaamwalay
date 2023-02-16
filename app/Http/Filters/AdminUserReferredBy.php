<?php

namespace App\Http\Filters;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminUserReferredBy implements Filter
{
    /**
     * @param  Builder<User>  $query
     * @param  string $value
     * @param  string  $property
     * @return void
     */
    public function __invoke(Builder $query, $value, string $property): void
    {
        if ($value) {
            $query->whereNotNull('referred_by');
        } else {
            $query->whereNull('referred_by');
        }
    }
}
