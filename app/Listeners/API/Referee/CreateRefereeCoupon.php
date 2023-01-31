<?php

namespace App\Listeners\API\Referee;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\RefereeCouponService;

class CreateRefereeCoupon
{
    public function __construct(protected RefereeCouponService $refereeCouponService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        if($event->user->referredBy){
            $this->refereeCouponService->createRefereeCoupon($event->user);
        }
    }
}
