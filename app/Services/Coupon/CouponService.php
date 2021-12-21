<?php

namespace App\Services\Coupon;

use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\Order;
use App\Services\Coupon\CouponApplicable\CouponApplicableInterface;
use App\Services\Coupon\CouponApplicable\ServiceFeeCoupon;
use App\Services\Coupon\CouponApplicable\ServiceLevelCoupon;
use App\Services\Coupon\CouponApplicable\ShippingFeeCoupon;

class CouponService
{
    public function returnCouponIfValid(string $couponCode, array $couponParams): Coupon
    {
        $coupon = Coupon::whereCode($couponCode)->IsActive()->ValidOnCurrentDate()->ValidOnCouponable($couponParams)->first();

        throw_if(! $coupon);

        return $coupon;
    }

    public function calculateDiscount(Coupon $coupon, Order $order): float
    {
        $couponApplication = $this->getCouponApplicationType($coupon->couponApplicable->code);

        return $couponApplication->calculateDiscount($coupon, $order);
    }

    protected function getCouponApplicationType($code): CouponApplicableInterface
    {
        return match ($code) {
            'service_level' => new ServiceLevelCoupon(),
            'shipping_fee' => new ShippingFeeCoupon(),
            default => new ServiceFeeCoupon(),
        };
    }
}
