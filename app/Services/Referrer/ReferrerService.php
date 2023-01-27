<?php

namespace App\Services\Referrer;

use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerService
{
    public function create(User $user): Referrer
    {
        try {
            $code = ReferralCodeGeneratorService::generate();

            return Referrer::create(['user_id' => $user->id, 'referral_code' => $code]);
        } catch(QueryException $e) {
            if ($e->errorInfo[1] === 1062) {
                return $this->create($user);
            }
        }
    }

    /**
     * @param  int  $referrerId
     * @return LengthAwarePaginator
     */
    public function getSignUps(int $referrerId): LengthAwarePaginator
    {
        $query = User::where('referred_by', $referrerId);
        $itemsPerPage = 10;

        return QueryBuilder::for($query)
            ->allowedSorts(['created_at'])
            ->defaultSort('-users.created_at')
            ->paginate($itemsPerPage);
    }

    /**
     * @param  int  $referrerId
     * @return LengthAwarePaginator
     */
    public function getCommissionEarnings(int $referrerId): LengthAwarePaginator
    {
        $query = Order::join('referrer_earned_commissions','orders.id','referrer_earned_commissions.order_id')
            ->join('referrers','referrer_earned_commissions.referrer_id','referrers.id')
            ->selectRaw('SUM(referrer_earned_commissions.commission) as commission')
            ->addSelect('orders.*')->where('referrers.id',$referrerId)->groupBy('orders.id');
        $itemsPerPage = 10;

        return QueryBuilder::for($query)
            ->allowedSorts(['created_at'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    /**
     * @param  Referrer  $referrer
     * @param  User  $referee
     * @return Collection<int, ReferrerEarnedCommission>
     */
    public function getEarnedCommissionsByReferee($referrerId, $refereeId): Collection
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
