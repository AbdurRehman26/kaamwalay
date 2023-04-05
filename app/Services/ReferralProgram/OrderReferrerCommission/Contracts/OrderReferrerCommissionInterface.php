<?php

namespace App\Services\ReferralProgram\OrderReferrerCommission\Contracts;

use App\Models\CommissionStructure;
use App\Models\Order;

interface OrderReferrerCommissionInterface
{
    public static function getFixedCommission(Order $order, CommissionStructure $commissionStructure): float;

    public static function getPercentageCommission(Order $order, CommissionStructure $commissionStructure): float;
}
