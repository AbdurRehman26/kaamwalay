<?php

namespace App\Services\SalesmanCommission\OrderCommission;

use App\Models\Order;

trait OrderCommissionTrait
{
    public static function calculateCommission(Order $order): float
    {
        return match ($order->salesman->salesmanProfile->commission_type->toString()) {
            'percentage' => self::getPercentageCommission($order),
            default => self::getFixedCommission($order),
        };
    }
}
