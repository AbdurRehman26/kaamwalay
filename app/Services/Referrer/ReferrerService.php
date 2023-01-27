<?php

namespace App\Services\Referrer;

use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;

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
     * @param  Referrer  $referrer
     * @return Collection<int, User>
     */
    public function getSignUps(Referrer $referrer): Collection
    {
        return $referrer->referees;
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
