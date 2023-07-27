<?php

namespace App\Services\ShippingInsuranceFee;

use App\Models\Order;

class ShippingInsuranceFeeService
{
    public function __construct(protected Order $order)
    {
    }

    public function calculate(): float
    {
        return round(($this->order->orderItems()->sum('declared_value_total') * config('robograding.feature_order_shipping_insurance_fee_percentage')) / 100, 2);
    }
}
