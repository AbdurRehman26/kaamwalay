<?php

namespace App\Listeners\API\ReferralProgram\Referrer;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\ReferralProgram\ReferrerService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class GenerateReferrerOnCustomerRegister implements ShouldBeEncrypted
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $this->referrerService->create($event->user);
    }
}
