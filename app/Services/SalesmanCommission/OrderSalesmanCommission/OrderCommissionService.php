<?php

namespace App\Services\SalesmanCommission\OrderSalesmanCommission;

use App\Enums\Salesman\CommissionEarnedEnum;
use App\Models\Order;

class OrderCommissionService
{
    protected array $orderLineCommissionService = [
        'order_created' => OrderCreateCommissionService::class,
        'order_refunded' => OrderRefundCommissionService::class,
        'order_extra_charge' => OrderExtraChargeCommission::class,
    ];

    public function getCommission(Order $order, CommissionEarnedEnum $orderCommissionType): float
    {
        return (float) number_format($this->orderLineCommissionService[$orderCommissionType->toString()]::calculateCommission($order), 2);
    }
}
