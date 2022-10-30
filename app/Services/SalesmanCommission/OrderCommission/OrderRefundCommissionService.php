<?php

namespace App\Services\SalesmanCommission\OrderCommission;

use App\Models\Order;
use App\Services\SalesmanCommission\OrderCommission\Contracts\OrderPercentageCommissionInterface;

class OrderRefundCommissionService implements OrderPercentageCommissionInterface
{
    use OrderCommissionTrait;

    public static function getPercentageCommission(Order $order): float
    {
        return $order->salesman->salesmanProfile->commission_value *  ( $order->refunds()->latest()->first()->amount );
    }
}
