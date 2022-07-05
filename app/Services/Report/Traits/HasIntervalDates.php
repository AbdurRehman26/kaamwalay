<?php

namespace App\Services\Report\Traits;

use DateTime;

trait HasIntervalDates
{
    protected function getFromDate(string $interval = 'weekly'): DateTime
    {
        return new DateTime(
            match ($interval) {
                'monthly' => now()->subMonth()->startOfMonth()->toDateString(),
                'yearly' => now()->subYear()->startOfYear()->toDateString(),
                default => now()->subDay()->subWeek()->toDateString()
            }
        );
    }

    protected function getToDate(string $interval = 'weekly'): DateTime
    {
        return new DateTime(
            match ($interval) {
                'monthly' => now()->subMonth()->endOfMonth()->toDateString(),
                'yearly' => now()->subYear()->endOfYear()->toDateString(),
                'default' => now()->subDay()->toDateString()
            }
        );
    }
}
