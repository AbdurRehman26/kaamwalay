<?php

namespace App\Services\StatsReport\StatsReportIntervals;

use App\Services\StatsReport\StatsReportIntervals\Contracts\StatsReportIntervalsInterface;
use App\Services\StatsReport\StatsReportIntervals\Traits\StatsReportGeneralMethods;
use App\Services\StatsReport\StatsReportIntervals\Traits\StatsReportIntervalDates;

class MonthlyStatsReportService implements StatsReportIntervalsInterface
{
    use StatsReportIntervalDates, StatsReportGeneralMethods;

    public function setFromDate(): void
    {
        $this->fromDate = now()->subMonth()->startOfMonth()->toDateString();
    }

    public function setToDate(): void
    {
        $this->toDate = now()->subMonth()->endOfMonth()->toDateString();
    }
}
