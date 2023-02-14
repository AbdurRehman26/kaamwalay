<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Models\Referrer;
use App\Services\ReferralProgram\ReferrerService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class IncreaseReferrerSuccessfulSignups implements ShouldBeEncrypted, ShouldQueue
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        if (array_key_exists('referral_code', $event->request) && $event->request['referral_code']) {
            $this->referrerService->increaseSuccessfulSignups(Referrer::where('referral_code', $event->request['referral_code'])->first());
        }
    }
}
