<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Coupon\CouponExpiredOrInvalid;
use App\Services\Coupon\V2\CouponService;

class CouponAppliedValidator
{
    public static function validate(array $data): void
    {
        if (! empty($data['coupon']['code'])) {
            if (is_array($data['items'])) {
                /** @var array<int, array> $items */
                $items = $data['items'];
            } else {
                /** @var int $items */
                $items = $data['items'];
            }

            throw_unless(
                CouponService::returnCouponIfValid(
                    $data['coupon']['code'],
                    [
                        'couponables_id' => $data['coupon']['couponables_id'] ?? $data['payment_plan']['id'],
                        'items_count' => is_int($items) ? $items : collect($items)->sum('quantity'),
                        'user_id' => !empty($data['user_id']) ? $data['user_id'] : null 
                    ]
                ),
                CouponExpiredOrInvalid::class
            );
        }
    }
}
