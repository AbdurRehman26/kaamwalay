<?php

namespace App\Services\Admin\Report\MarketingReport;

/**
 * On request of Alex Kegan (Marketing)
 */
class MarketingWeeklyReport extends MarketingReport
{
    public function shouldSendNow(): bool
    {
        return now()->isDayOfWeek(1);
    }

    public function getReportTitle(): string
    {
        return "Marketing Report (Weekly)";
    }

    public function getReportData(): array
    {
        return $this->getDataForReport(now()->subWeek()->startOfDay(), now()->subDay()->endOfDay());
    }
}
