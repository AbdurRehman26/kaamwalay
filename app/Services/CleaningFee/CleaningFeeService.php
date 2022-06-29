<?php

namespace App\Services\CleaningFee;

use App\Models\Order;

class CleaningFeeService
{
    protected const FEE_FOR_ONE_CARD = 5.00;
    protected const MAX_CLEANING_FEE_CAP = 100.00;

    public function __construct(protected Order $order)
    {
    }

    public function calculate(): float
    {
        $cleaningFee = $this->getCleaningFee();

        return $cleaningFee > 100
            ? self::MAX_CLEANING_FEE_CAP
            : $cleaningFee;
    }

    protected function getCleaningFee(): float
    {
        return $this->order->orderItems()->count() * self::FEE_FOR_ONE_CARD;
    }
}
