<?php

namespace App\Services\Coupon\V2\CouponApplicable;

use App\Models\Order;

class UserReferralCoupon extends ServiceFeeCoupon
{
    private const MAX_ITEM_QUANTITY = 20;

    public function getOrderItemsQuantity(Order|array $order): float|int
    {
        return min(array_sum(array_column($this->getOrderItems($order), 'quantity')), self::MAX_ITEM_QUANTITY);
    }
}
