<?php

namespace App\Services\Coupon\V2\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

interface CouponApplicableInterface
{
    public function calculateDiscount(Coupon $coupon, Order|array $order): float;

    public function getFixedDiscount(Coupon $coupon, Order|array $order): float;

    public function getFlatDiscount(Coupon $coupon, Order|array $order): float;

    public function getPercentageDiscount(Coupon $coupon, Order|array $order): float;
}
