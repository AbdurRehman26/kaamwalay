<?php

namespace App\Events\API\Admin\Coupon;

use App\Models\Coupon;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewCouponAdded
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(public Coupon $coupon)
    {
    }
}
