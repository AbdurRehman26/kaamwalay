<?php

namespace App\Services\StatsReport\StatsReportIntervals\Contracts;

interface StatsReportIntervalsInterface
{
    public function setFromDate();
    public function setToDate();
    public function setIntervalDates();
    public function getReportData(string $fromDate, string $toDate);
}
