<?php

namespace App\Services\Report\Traits;

use DateTime;
use Exception;

trait HasIntervalDates
{
    /**
     * @throws Exception
     */
    protected function getFromDate(string $interval): DateTime
    {
        $fromDates = [
            'weekly' => now()->subDay()->subWeek()->toDateString(),
            'monthly' => now()->subMonth()->startOfMonth()->toDateString(),
            'yearly' => now()->subYear()->startOfYear()->toDateString()
        ];

        return new DateTime($fromDates[$interval]);
    }

    /**
     * @throws Exception
     */
    protected function getToDate(string $interval): DateTime
    {
        $toDates = [
            'weekly' => now()->subDay()->toDateString(),
            'monthly' => now()->subMonth()->endOfMonth()->toDateString(),
            'yearly' => now()->subYear()->endOfYear()->toDateString()
        ];

        return new DateTime($toDates[$interval]);
    }
}
