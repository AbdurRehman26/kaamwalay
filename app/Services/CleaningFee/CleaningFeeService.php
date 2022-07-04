<?php

namespace App\Services\CleaningFee;

use App\Models\Order;

class CleaningFeeService
{
    public function __construct(protected Order $order)
    {
    }

    public function calculate(): float
    {
        $cleaningFee = $this->getCleaningFee();

        return $cleaningFee > config('robograding.feature_order_cleaning_fee_max_cap')
            ? config('robograding.feature_order_cleaning_fee_max_cap')
            : $cleaningFee;
    }

    protected function getCleaningFee(): float
    {
        return $this->order->orderItems()->count() * config('robograding.feature_order_cleaning_fee_per_card');
    }
}
