<?php

namespace App\Services\SalesmanCommission\OrderExtraChargeCommission;

use App\Models\Order;
use App\Services\SalesmanCommission\OrderExtraChargeCommission\Contracts\OrderPercentageCommissionInterface;

class OrderExtraChargeCommission implements OrderPercentageCommissionInterface
{
    use OrderCommissionTrait;

    public static function getPercentageCommission(Order $order): float
    {
        return $order->salesman->salesmanProfile->commission_value * ($order->extraCharges()->latest()->first()->amount);
    }
}
