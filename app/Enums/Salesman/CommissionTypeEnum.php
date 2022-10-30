<?php

namespace App\Enums\Salesman;

enum CommissionTypeEnum: string
{
    case PERCENTAGE = '0';
    case FIXED = '1';

    public function toString(): string
    {
        return match ($this) {
            self::PERCENTAGE => 'percentage',
            self::FIXED => 'fixed',
        };
    }
}
