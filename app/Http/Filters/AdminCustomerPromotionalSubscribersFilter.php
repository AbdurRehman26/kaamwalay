<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

/**
 * @template TModelClass of \App\Models\User
 */
class AdminCustomerPromotionalSubscribersFilter implements Filter
{
    /**
     * @param string $value
     */
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->where(
            'marketing_notifications_enabled',
            $value
        );
    }
}
