<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Models\Referrer;

class ReferralController extends Controller
{
    public function getReferralPage(string $code): string
    {
        $referral = Referrer::where('referral_code', $code)->first();  
        if($referral) {
            $referBy = $referral->user->name;

            return view('landings.referralhome.view', ['referBy' => $referBy]);
        }
        return redirect('/');
    }
}
