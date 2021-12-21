<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Coupon\CouponExpiredOrInvalid;
use App\Services\Coupon\CouponService;

class CouponAppliedValidator
{
    public static function validate(array $data)
    {
        if (! empty($data['coupon']['code'])) {
            throw_unless(
                CouponService::returnCouponIfValid(
                    $data['coupon']['code'],
                    [
                        'couponable_type' => $data['coupon']['couponable_type'] ?? 'service_level',
                        'couponable_id' => $data['coupon']['couponable_id'] ?? $data['payment_plan']['id'],
                    ]
                ),
                CouponExpiredOrInvalid::class
            );
        }
    }
}
