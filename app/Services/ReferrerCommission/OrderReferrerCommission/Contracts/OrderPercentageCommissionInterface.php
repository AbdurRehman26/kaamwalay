<?php

namespace App\Services\ReferrerCommission\OrderReferrerCommission\Contracts;

use App\Models\CommissionStructure;
use App\Models\Order;

interface OrderPercentageCommissionInterface
{
    public static function getPercentageCommission(Order $order, CommissionStructure $commissionStructure): float;
}
