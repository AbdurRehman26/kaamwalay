<?php

namespace App\Services\SalesmanCommission\OrderSalesmanCommission\Contracts;

use App\Models\Order;

interface OrderFixedCommissionInterface
{
    public static function getFixedCommission(Order $order): float;
}
