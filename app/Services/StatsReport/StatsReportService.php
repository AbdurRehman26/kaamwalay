<?php

namespace App\Services\StatsReport;

use App\Services\StatsReport\StatsReportIntervals\StatsReportIntervalsInterface;

class StatsReportService
{
    public static function generateReportFor(StatsReportIntervalsInterface $statsReportInterval)
    {
        $statsReportInterval->setIntervalDates();
        $statsReportInterval->getReportData();
    }

}
