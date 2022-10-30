<?php

namespace App\Services\SalesmanCommission\OrderExtraChargeCommission;

use App\Models\Order;
use App\Services\SalesmanCommission\OrderExtraChargeCommission\Contracts\OrderFixedCommissionInterface;
use App\Services\SalesmanCommission\OrderExtraChargeCommission\Contracts\OrderPercentageCommissionInterface;

class OrderCreateCommissionService implements OrderPercentageCommissionInterface, OrderFixedCommissionInterface
{
    use OrderCommissionTrait;

    public static function getPercentageCommission(Order $order): float
    {
        return $order->salesman->salesmanProfile->commission_value *  ( $order->grand_total - $order->refund_total + $order->extra_charge_total );
    }

    public static function getFixedCommission(Order $order): float
    {
        return $order->salesman->salesmanProfile->commission_value * $order->orderItems()->count();
    }
}
