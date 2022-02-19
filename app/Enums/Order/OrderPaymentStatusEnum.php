<?php

namespace App\Enums\Order;

enum OrderPaymentStatusEnum: int
{
    case PENDING = 0;
    case PAID = 1;

    public function toString(): string
    {
        return match ($this) {
            self::PENDING => 'pending',
            self::PAID => 'paid',
        };
    }
}
