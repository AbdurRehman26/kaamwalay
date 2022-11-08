<?php

namespace App\Services\SalesmanCommission\OrderExtraChargeCommission;

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

    public static function getPercentageCommission(Order $order): float
    {
        return $order->salesman->salesmanProfile->commission_value * ($order->grand_total - $order->refund_total + $order->extra_charge_total);
    }

    public static function getFixedCommission(Order $order): float
    {
        return $order->salesman->salesmanProfile->commission_value * $order->orderItems()->count();
    }
}
