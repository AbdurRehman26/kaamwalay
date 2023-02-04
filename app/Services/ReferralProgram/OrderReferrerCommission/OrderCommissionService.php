<?php

namespace App\Services\ReferralProgram\OrderReferrerCommission;

use App\Enums\ReferralProgram\Referrer\CommissionEarnedEnum;
use App\Models\CommissionStructure;
use App\Models\Order;

class OrderCommissionService
{
    protected array $commissionServiceInstances = [
        'order_paid' => OrderPaidCommissionService::class,
    ];

    public function getCommission(Order $order, CommissionStructure $commissionStructure, CommissionEarnedEnum $orderCommissionType): float
    {
        return round($this->commissionServiceInstances[$orderCommissionType->toString()]::calculateCommission($order, $commissionStructure), 2);
    }
}
