<?php

namespace App\Services\Coupon;

use App\Models\Coupon;
use App\Models\Order;
use App\Services\Coupon\CouponApplicable\CouponApplicableInterface;
use App\Services\Coupon\CouponApplicable\ServiceFeeCoupon;
use App\Services\Coupon\CouponApplicable\ServiceLevelCoupon;

class CouponService
{
    public function returnCouponIfValid(string $couponCode): Coupon
    {
        $coupon = Coupon::whereCode($couponCode)->ValidOnCurrentDate()->first();

        throw_if(! $coupon);

        return $coupon;
    }

    public function calculateDiscount(Coupon $coupon, Order $order): float
    {
        $couponApplication = $this->getCouponApplicationType($coupon->couponApplicable->code);
        dd($couponApplication->calculateDiscount($coupon, $order));

        dd($this->couponApplications[$coupon->couponApplicable?->code], $orderData);

        return 1.0;
    }

    protected function getCouponApplicationType($code): CouponApplicableInterface
    {
        return match ($code) {
            'service_fee' => new ServiceFeeCoupon(),
            default => new ServiceLevelCoupon(),
        };
    }
}
