<?php

namespace App\Enums\Coupon;

enum CouponMinThresholdTypeEnum: int
{
    case NONE = 0;
    case CARD_COUNT = 1;
    case AMOUNT = 2;
}
