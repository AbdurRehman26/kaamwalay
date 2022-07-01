<?php

namespace App\Services\StatsReport;

class StatsReportService
{
    private string $fromDate;
    private string $toDate;

    public function __construct(StatsReortInterval $interval = 'weekly')
    {
        $this->setIntervalDates($interval);
    }

    public function setIntervalDates(string $interval): void
    {
        $this->setFromDate($interval);
        $this->setToDate($interval);
    }

    private function setToDate(string $interval): void
    {
    }

    private function setFromDate(string $interval): void
    {
    }
}
