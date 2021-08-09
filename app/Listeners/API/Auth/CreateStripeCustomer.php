<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;

class CreateStripeCustomer
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function handle(CustomerRegistered $event): void
    {
        $user = $event->user;
        if (! $user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }
    }
}