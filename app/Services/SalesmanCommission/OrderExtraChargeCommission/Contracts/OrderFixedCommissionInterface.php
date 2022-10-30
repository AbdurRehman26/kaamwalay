<?php

namespace App\Services\SalesmanCommission\OrderExtraChargeCommission\Contracts;

use App\Models\Order;

interface OrderFixedCommissionInterface
{
    public static function getFixedCommission(Order $order): float;
}
