<?php

namespace App\Services\SalesmanCommission\OrderSalesmanCommission;

use App\Models\Order;
use App\Services\SalesmanCommission\OrderSalesmanCommission\Contracts\OrderPercentageCommissionInterface;

class OrderExtraChargeCommission implements OrderPercentageCommissionInterface
{
    use OrderCommissionTrait;

    public static function getPercentageCommission(Order $order): float
    {
        return ( $order->salesman->salesmanProfile->commission_value * ($order->extraCharges()->latest()->first()->amount) / 100);
    }
}
