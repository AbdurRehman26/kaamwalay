<?php

namespace App\Services\StatsReport\StatsReportIntervals\Traits;

trait StatsReportIntervalDates
{
    protected string $fromDate;
    protected string $toDate;

    public function setIntervalDates(): void
    {
        $this->setFromDate();
        $this->setToDate();
    }

    public function getToDate(): string
    {
        return $this->toDate;
    }

    public function getFromDate(): string
    {
        return $this->fromDate;
    }
}
