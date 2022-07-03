<?php

namespace App\Services\StatsReport\StatsReportIntervals;

use App\Services\StatsReport\StatsReportIntervals\Contracts\StatsReportIntervalsInterface;
use App\Services\StatsReport\StatsReportIntervals\Traits\StatsReportGeneralMethods;
use App\Services\StatsReport\StatsReportIntervals\Traits\StatsReportIntervalDates;

class YearlyStatsReportService implements StatsReportIntervalsInterface
{
    use StatsReportIntervalDates, StatsReportGeneralMethods;

    public function setFromDate(): void
    {
        $this->fromDate = now()->subYear()->startOfYear()->toDateString();
    }

    public function setToDate(): void
    {
        $this->toDate = now()->subYear()->endOfYear()->toDateString();
    }
}
