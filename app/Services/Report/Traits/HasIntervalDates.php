<?php

namespace App\Services\Report\Traits;

use DateTime;

trait HasIntervalDates
{
    protected function getFromDate(string $interval = 'weekly'): DateTime
    {
        return match ($interval) {
            'monthly' => now()->subMonth()->startOfMonth(),
            'yearly' => now()->subYear()->startOfYear(),
            default => now()->subDay()->subWeek()
        };
    }

    protected function getToDate(string $interval = 'weekly'): DateTime
    {
        return match ($interval) {
            'monthly' => now()->subMonth()->endOfMonth(),
            'yearly' => now()->subYear()->endOfYear(),
            default => now()->subDay()
        };
    }
}
