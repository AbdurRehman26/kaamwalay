<?php

namespace App\Enums\Order;

enum OrderPaymentStatusEnum: int
{
    case PENDING = 0;
    case DUE = 1;
    case PAID = 2;

    public function isPaid(): bool
    {
        return match ($this) {
            self::PAID => true,
            default => false,
        };
    }
}
