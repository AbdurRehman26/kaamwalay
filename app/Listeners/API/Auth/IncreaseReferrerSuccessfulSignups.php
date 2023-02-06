<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Models\Referrer;
use App\Services\ReferralProgram\ReferrerService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class IncreaseReferrerSuccessfulSignups implements ShouldBeEncrypted
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $this->referrerService->increaseSuccessfulSignups(Referrer::where('referral_code', $event->request['referral_code'])->first());
    }
}
