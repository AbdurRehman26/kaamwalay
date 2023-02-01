<?php

namespace App\Services\ReferrerCommission\OrderReferrerCommission\Contracts;

use App\Models\CommissionStructure;
use App\Models\Order;

interface OrderFixedCommissionInterface
{
    public static function getFixedCommission(Order $order, CommissionStructure $commissionStructure): float;
}
