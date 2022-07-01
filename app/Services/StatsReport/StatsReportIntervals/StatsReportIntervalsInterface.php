<?php

namespace App\Services\StatsReport\StatsReportIntervals;

interface StatsReportIntervalsInterface
{
    public function setFromDate();
    public function setToDate();
    public function setIntervalDates();
    public function getReportData();
}
