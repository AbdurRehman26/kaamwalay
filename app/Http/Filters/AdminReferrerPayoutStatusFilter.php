<?php

namespace App\Http\Filters;

use App\Models\ReferrerPayoutStatus;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminReferrerPayoutStatusFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $values = [$value];

        if(intval($value) === ReferrerPayoutStatus::STATUS_PENDING)
        {
            $values = [ReferrerPayoutStatus::STATUS_PENDING, ReferrerPayoutStatus::STATUS_PROCESSING];
        }

        $query->whereIn(
            'referrer_payout_status_id',
            $values
        );
    }
}
