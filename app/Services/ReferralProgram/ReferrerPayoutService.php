<?php

namespace App\Services\ReferralProgram;

use App\Models\PayoutStatus;
use App\Models\ReferrerPayout;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerPayoutService
{
    protected const DEFAULT_PAGE_SIZE = 10;

    public function getReferrerPayouts(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?? self::DEFAULT_PAGE_SIZE;

        return QueryBuilder::for(ReferrerPayout::query())
            ->with('payoutStatus')
            ->allowedSorts(['initiated_at'])
            ->defaultSort('-initiated_at')
            ->paginate($itemsPerPage);
    }

    public function create(array $data): ReferrerPayout
    {
        return ReferrerPayout::create(
            array_merge($data, [
                    'user_id' => auth()->user()->id,
                    'initiated_at' => now(),
                    'payment_method' => ReferrerPayout::PAYMENT_METHODS[0],
                    'payout_status_id' => PayoutStatus::STATUS_PENDING
                ]
            ));
    }
}
