<?php

namespace App\Services\SalesmanCommission;

use App\Models\Order;

class OrderCommissionService
{
    public static function onCreateOrder(Order $order)
    {
        dd($order);
    }
}
