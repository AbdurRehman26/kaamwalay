<?php

namespace App\Listeners\API\Coupon;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Coupon\V2\CouponService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateCouponLogsAndStatsListener implements ShouldQueue
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
     */
    public function handle(OrderPaid $event): void
    {
        if (! $event->order->coupon || ! $event->order->discounted_amount) {
            return;
        }

        $this->couponService->updateCouponLogs($event->order);
        $this->couponService->updateCouponStats($event->order->coupon);
    }
}
