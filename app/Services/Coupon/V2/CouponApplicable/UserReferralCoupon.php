<?php

namespace App\Services\Coupon\V2\CouponApplicable;

use App\Models\Order;

class UserReferralCoupon extends ServiceFeeCoupon
{
    CONST MAX_ITEM_QUANTITY = 20;
    public function getOrderItemsQuantity(Order|array $order): array
    {
        return min(array_column($this->getOrderItems($order), 'quantity'), self::MAX_ITEM_QUANTITY);
    }
}
