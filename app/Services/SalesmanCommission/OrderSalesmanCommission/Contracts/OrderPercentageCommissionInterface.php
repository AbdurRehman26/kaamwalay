<?php

namespace App\Services\SalesmanCommission\OrderSalesmanCommission\Contracts;

use App\Models\Order;

interface OrderPercentageCommissionInterface
{
    public static function getPercentageCommission(Order $order): float;
}
