<?php

namespace App\Services\ReferrerCommission\OrderReferrerCommission;

use App\Enums\Referrer\CommissionEarnedEnum;
use App\Models\CommissionStructure;
use App\Models\Order;
use App\Models\Referrer;

class OrderCommissionService
{
    protected array $orderLineCommissionService = [
        'order_paid' => OrderPaidCommissionService::class,
    ];

    public function getCommission(Order $order, CommissionStructure $commissionStructure, CommissionEarnedEnum $orderCommissionType): float
    {
        return round($this->orderLineCommissionService[$orderCommissionType->toString()]::calculateCommission($order, $commissionStructure), 2);
    }
}
