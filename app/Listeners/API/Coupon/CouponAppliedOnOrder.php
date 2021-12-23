<?php

namespace App\Listeners\API\Coupon;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Coupon\CouponService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CouponAppliedOnOrder implements ShouldQueue
{
    use InteractsWithQueue;

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
     * @param  OrderPaid  $event
     * @return void
     */
    public function handle(OrderPaid $event)
    {
        if (! $event->order->coupon || ! $event->order->discounted_amount) {
            return;
        }

        $this->couponService->updateCouponLogs($event->order);
        $this->couponService->updateCouponStats($event->order->coupon);
    }
}
