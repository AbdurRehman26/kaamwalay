<?php

namespace App\Listeners\API\ReferralProgram\Referee;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\ReferralProgram\RefereeCouponService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class CreateRefereeCoupon implements ShouldBeEncrypted
{
    public function __construct(protected RefereeCouponService $refereeCouponService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        if ($event->user->referredBy) {
            $this->refereeCouponService->createRefereeCoupon($event->user);
        }
    }
}
