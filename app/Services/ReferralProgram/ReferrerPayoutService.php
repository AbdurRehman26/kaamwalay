<?php

namespace App\Services\ReferralProgram;

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
}
