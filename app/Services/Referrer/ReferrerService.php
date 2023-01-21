<?php

namespace App\Services\Referrer;

use App\Models\Referrer;
use App\Models\User;

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
}
