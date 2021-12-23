<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Coupon\CouponExpiredOrInvalid;
use App\Services\Coupon\CouponService;

class CouponAppliedValidator
{
    public static function validate(array $data): void
    {
        if (! empty($data['coupon']['code'])) {
            throw_unless(
                CouponService::returnCouponIfValid(
                    $data['coupon']['code'],
                    [
                        'couponables_type' => $data['coupon']['couponables_type'] ?? 'service_level',
                        'couponables_id' => $data['coupon']['couponables_id'] ?? $data['payment_plan']['id'],
                    ]
                ),
                CouponExpiredOrInvalid::class
            );
        }
    }
}
