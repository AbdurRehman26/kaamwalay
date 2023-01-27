<?php

namespace App\Services\ReferrerCommission\OrderReferrerCommission;

use App\Models\CommissionStructure;
use App\Models\Order;

trait OrderCommissionTrait
{
    public static function calculateCommission(Order $order, CommissionStructure $commissionStructure): float
    {
        $percentageCommission = self::getPercentageCommission($order, $commissionStructure);
        $fixedCommission = self::getFixedCommission($order, $commissionStructure);

        return min($percentageCommission, $fixedCommission);
    }

    public static function getPercentageCommission(Order $order, CommissionStructure $commissionStructure): float
    {
        return (($commissionStructure->percentage_value * ($order->grand_total - $order->refund_total + $order->extra_charge_total)) / 100);
    }

    public static function getFixedCommission(Order $order, CommissionStructure $commissionStructure): float
    {
        return $commissionStructure->fixed_value_per_card * $order->orderItems()->count();
    }
}
