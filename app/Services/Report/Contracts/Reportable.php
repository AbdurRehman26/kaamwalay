<?php

namespace App\Services\Report\Contracts;

use DateTime;

interface Reportable
{
    public function getReportData(DateTime $fromDate, DateTime $toDate): array;

    public function getReportTitle(string $interval = 'weekly'): string;

    public function getTemplate(): string;
}
