<?php

namespace App\Enums\ReferralProgram\Referrer;

enum CommissionEarnedEnum: int
{
    case ORDER_PAID = 1;
    case ORDER_REFUNDED = 2;
    case ORDER_EXTRA_CHARGE = 3;

    public function toString(): string
    {
        return match ($this) {
            self::ORDER_PAID => 'order_paid',
            self::ORDER_REFUNDED => 'order_refunded',
            self::ORDER_EXTRA_CHARGE => 'order_extra_charge',
        };
    }
}
