<?php

namespace App\Services\SalesmanCommission\OrderExtraChargeCommission;

use App\Enums\Salesman\CommissionEarnedEnum;
use App\Models\Order;

class OrderCommissionService
{
    protected array $orderLineCommissionService = [
        'order_created' => OrderCreateCommissionService::class,
        'order_refunded' => OrderRefundCommissionService::class,
        'order_extra_charge' => OrderExtraChargeCommission::class
    ];

    public function getCommission(Order $order, CommissionEarnedEnum $orderCommissionType): float
    {
        return $this->orderLineCommissionService[$orderCommissionType->toString()]::calculateCommission($order);
    }
}
