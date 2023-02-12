<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

/**
 * @template TModelClass of \App\Models\User
 */
class AdminUserReferredBy implements Filter
{
    /**
     * @param string $value
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
