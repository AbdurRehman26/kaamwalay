<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\Payment\Providers\StripeService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateStripeCustomer implements ShouldQueue, ShouldBeEncrypted
{
    public function __construct(protected StripeService $stripeService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $user = $event->user;
        $this->stripeService->createCustomerIfNull($user);
    }
}
