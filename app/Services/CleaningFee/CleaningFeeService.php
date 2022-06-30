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

        return $cleaningFee > config('configuration.keys.cleaning_fee_max_cap.value')
            ? config('configuration.keys.cleaning_fee_max_cap.value')
            : $cleaningFee;
    }

    protected function getCleaningFee(): float
    {
        return $this->order->orderItems()->count() * config('configuration.keys.cleaning_fee_per_card.value');
    }
}
