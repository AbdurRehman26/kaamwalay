<?php

namespace App\Services\Referrer;

use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Illuminate\Support\Collection;

class ReferrerService
{
    public function create(User $user): Referrer
    {
        $code = '';
        $isNewCode = false;

        while (! $isNewCode) {
            $code = ReferralCodeGeneratorService::generate();

            $isNewCode = Referrer::where('referral_code', $code)->count() === 0;
        }

        return Referrer::create(['user_id' => $user->id, 'referral_code' => $code]);
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
    public function getEarnedCommissionsByReferee(Referrer $referrer, User $referee): Collection
    {
        return $referrer->earnedCommissions()->join('orders', 'orders.id', 'referrer_earned_commissions.order_id')
            ->where('orders.user_id', $referee->id)->select('referrer_earned_commissions.*')->get();
    }

    public function getTotalCommissionsByReferee(Referrer $referrer, User $referee): float
    {
        return $this->getEarnedCommissionsByReferee($referrer, $referee)->sum('commission');
    }
}
