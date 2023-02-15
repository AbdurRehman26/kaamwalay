<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminReferrerStatusFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->where(
            'referrers.is_referral_active',
            $value
        );
    }
}
