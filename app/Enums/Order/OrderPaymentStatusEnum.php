<?php

namespace App\Enums\Order;

enum OrderPaymentStatusEnum: int
{
    case PENDING = 0;
    case DUE = 1;
    case PAID = 2;

    public function toString(): string
    {
        return match ($this) {
            self::PENDING => 'PENDING',
            self::DUE => 'PAYMENT DUE',
            self::PAID => 'PAID',
        };
    }
}
