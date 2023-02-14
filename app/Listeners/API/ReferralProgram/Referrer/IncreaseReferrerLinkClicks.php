<?php

namespace App\Listeners\API\ReferralProgram\Referrer;

use App\Events\Landings\ReferralLandingOpened;
use App\Services\ReferralProgram\ReferrerService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class IncreaseReferrerLinkClicks implements ShouldQueue, ShouldBeEncrypted
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function handle(ReferralLandingOpened $event): void
    {
        $this->referrerService->increaseLinkClicks($event->referrer);
    }
}
