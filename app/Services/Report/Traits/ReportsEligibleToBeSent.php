<?php

namespace App\Services\Report\Traits;

trait ReportsEligibleToBeSent
{
    public function isEligibleToBeSentWeekly(): bool
    {
        return now()->isDayOfWeek(1);
    }

    public function isEligibleToBeSentMonthly(): bool
    {
        return now()->firstOfMonth()->isCurrentDay();
    }

    public function isEligibleToBeSentQuarterly(): bool
    {
        return now()->firstOfQuarter()->isCurrentDay();
    }
}
