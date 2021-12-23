<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

interface CouponApplicableInterface
{
    public function calculateDiscount(Coupon $coupon, Order|array $order): float;
}
