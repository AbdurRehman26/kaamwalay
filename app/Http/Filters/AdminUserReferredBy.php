<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminUserReferredBy implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        if ($value) {
            $query->whereNotNull('referred_by');
        } else {
            $query->whereNull('referred_by');
        }
    }
}
