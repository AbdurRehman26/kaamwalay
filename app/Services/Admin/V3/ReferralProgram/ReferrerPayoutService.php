<?php
namespace App\Services\Admin\V3\ReferralProgram;

use App\Models\ReferrerPayout;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerPayoutService
{
    protected const PER_PAGE = 10;

    public function list(): LengthAwarePaginator
    {
        return QueryBuilder::for(ReferrerPayout::class)
            ->defaultSort('-created_at')
            ->with(['user', 'paidBy', 'payoutStatus'])
            ->paginate(request('per_page', self::PER_PAGE));
    }
}
