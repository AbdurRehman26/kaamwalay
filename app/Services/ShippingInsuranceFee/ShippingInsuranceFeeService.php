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
        return $this->order->orderItems()->sum('declared_value_total') * config('robograding.feature_order_insurance_shipping_fee_percentage') / 100;
    }

}
