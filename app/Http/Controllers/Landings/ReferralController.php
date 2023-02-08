<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Models\Referrer;

class ReferralController extends Controller
{
    public function getReferralPage(string $referralCode)
    {
        $referral = Referrer::where('referral_code', $referralCode)->first();
        if ($referral) {
            $referBy = $referral->user->name;

            return view('landings.referralhome.view', ['referBy' => $referBy, 'referralCode' => $referralCode]);
        }

        return redirect('/');
    }
}
