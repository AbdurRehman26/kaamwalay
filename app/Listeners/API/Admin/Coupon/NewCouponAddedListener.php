<?php

namespace App\Listeners\API\Admin\Coupon;

use App\Events\API\Admin\Coupon\NewCouponAdded;

class NewCouponAddedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(NewCouponAdded $event): void
    {
    }
}
