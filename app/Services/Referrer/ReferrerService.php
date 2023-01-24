<?php

namespace App\Services\Referrer;

use App\Models\Referrer;
use App\Models\User;
use Illuminate\Support\Collection;

class ReferrerService
{
    public function generateReferralCode(): string
    {
        //TODO: Change for proper generator
        //TODO: Check for correct length
        return 'R'.substr(md5(microtime()), 0, 7);
    }

    public function createUserReferrer(User $user): Referrer
    {
        $code = '';
        $isNewCode = false;

        while (! $isNewCode) {
            $code = $this->generateReferralCode();

            $isNewCode = Referrer::where('referral_code', $code)->count() === 0;
        }

        return Referrer::create(['user_id' => $user->id, 'referral_code' => $code]);
    }

    public function getSignUps(Referrer $referrer): Collection
    {
        return $referrer->referees;
    }

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
