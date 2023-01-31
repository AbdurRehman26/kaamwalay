<?php

namespace App\Services\Admin\V3;

use App\Models\Order;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerService
{
    /**
     * @return LengthAwarePaginator
     */
    // @phpstan-ignore-next-line
    public function getSignUps(): LengthAwarePaginator
    {
        $itemsPerPage = 10;

        return QueryBuilder::for(User::class)
            ->allowedSorts(['created_at'])
            ->allowedFilters(['referred_by'])
            ->defaultSort('-users.created_at')
            ->paginate($itemsPerPage);
    }

    /**
     * @param  int  $referrerId
     * @return LengthAwarePaginator
     */
    // @phpstan-ignore-next-line
    public function getCommissionEarnings(): LengthAwarePaginator
    {
        $query = Order::join('referrer_earned_commissions', 'orders.id', 'referrer_earned_commissions.order_id')
            ->join('referrers', 'referrer_earned_commissions.referrer_id', 'referrers.id')
            ->selectRaw('SUM(referrer_earned_commissions.commission) as commission')
            ->addSelect('orders.*')->groupBy('orders.id');
        $itemsPerPage = 10;

        return QueryBuilder::for($query)
            ->allowedSorts(['created_at'])
            ->defaultSort('-orders.created_at')
            ->allowedFilters(['user_id'])
            ->paginate($itemsPerPage);
    }

    /**
     * @param  int $referrerId
     * @param  int $refereeId
     * @return Collection<int, ReferrerEarnedCommission>
     */
    public function getEarnedCommissionsByReferee(int $referrerId, int $refereeId): Collection
    {
        return ReferrerEarnedCommission::join('orders', 'orders.id', 'referrer_earned_commissions.order_id')
            ->join('referrers', 'referrers.id', 'referrer_earned_commissions.referrer_id')
            ->where('orders.user_id', $refereeId)
            ->where('referrers.user_id', $referrerId)
            ->select('referrer_earned_commissions.*')->get();
    }

    public function getTotalReferrerCommissionsByReferee(int $referrerId, int $refereeId): float
    {
        return $this->getEarnedCommissionsByReferee($referrerId, $refereeId)->sum('commission');
    }
}
