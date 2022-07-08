<?php

namespace App\Services\Report\Traits;

use DateTime;

trait HasIntervalDates
{
    protected function getFromDate(string $interval = 'weekly'): DateTime
    {
        return match ($interval) {
            'monthly' => now()->subMonth()->startOfMonth(),
            'quarterly' => now()->subMonth()->startOfQuarter(),
            default => now()->subWeek()->startOfDay()
        };
    }

    protected function getToDate(string $interval = 'weekly'): DateTime
    {
        return match ($interval) {
            'monthly' => now()->subMonth()->endOfMonth(),
            'quarterly' => now()->subMonth()->endOfQuarter(),
            default => now()->startOfDay()
        };
    }
}
