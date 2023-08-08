<?php

namespace App\Http\Controllers\Landings;

use App\Events\Landings\ReferralLandingOpened;
use App\Http\Controllers\Controller;
use App\Models\Referrer;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ReferralController extends Controller
{
    public function index(): View
    {
        return view('landings.referral.view');
    }

    public function getReferralPage(string $referralCode): RedirectResponse|View
    {
        $referral = Referrer::where('referral_code', $referralCode)->first();
        if ($referral && $referral->user) {
            $referBy = $referral->user->name;

            ReferralLandingOpened::dispatch($referral);

            return view('landings.referralhome.view', ['referBy' => $referBy, 'referralCode' => $referralCode]);
        }

        return redirect('/');
    }
}
