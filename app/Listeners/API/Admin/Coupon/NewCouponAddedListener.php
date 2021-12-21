<?php

namespace App\Listeners\API\Admin\Coupon;

use App\Events\API\Admin\Coupon\NewCouponAdded;
use App\Services\Admin\Coupon\CouponService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NewCouponAddedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected CouponService $couponService)
    {
    }

    /**
     * Handle the event.
     *
     * @param  NewCouponAdded  $event
     * @return void
     */
    public function handle(NewCouponAdded $event)
    {
        $this->couponService->createCouponStats($event->coupon);
    }
}
