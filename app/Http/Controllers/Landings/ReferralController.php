<?php

namespace App\Http\Controllers\Landings;

use App\Events\Landings\ReferralLandingOpened;
use App\Http\Controllers\Controller;
use App\Models\Referrer;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ReferralController extends Controller
{
    public function getReferralPage(string $referralCode): RedirectResponse | View
    {
        $referral = Referrer::where('referral_code', $referralCode)->first();
        if ($referral) {
            $referBy = $referral->user->name;

            ReferralLandingOpened::dispatch($referral);

            return view('landings.referralhome.view', ['referBy' => $referBy, 'referralCode' => $referralCode]);
        }

        return redirect('/');
    }

    public function getPartnerPage(): View
    {
        return view('landings.referral.view');
    }
}
