<?php

namespace App\Services\StatsReport;

use App\Services\StatsReport\StatsReportIntervals\Contracts\StatsReportIntervalsInterface;

class StatsReportService
{
    public static function generateReport(StatsReportIntervalsInterface $statsReportInterval)
    {
        $statsReportInterval->setIntervalDates();
        return $statsReportInterval->getReportData($statsReportInterval->getFromDate(), $statsReportInterval->getToDate());
    }

}
