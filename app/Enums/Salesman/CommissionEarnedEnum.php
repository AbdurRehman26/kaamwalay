<?php

namespace App\Enums\Salesman;

enum CommissionEarnedEnum: int
{
    case ORDER_CREATED = 1;
    case ORDER_REFUNDED = 2;
    case ORDER_EXTRA_CHARGE = 3;

    public function toString(): string
    {
        return match ($this) {
            self::ORDER_CREATED => 'order_created',
            self::ORDER_REFUNDED => 'order_refunded',
            self::ORDER_EXTRA_CHARGE => 'order_extra_charge',
        };
    }
}
