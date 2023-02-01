<?php

namespace App\Listeners\API\Referrer;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\Referrer\ReferrerService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class GenerateReferrerOnCustomerRegister implements ShouldBeEncrypted
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $user = $event->user;

        $this->referrerService->create($user);
    }
}
