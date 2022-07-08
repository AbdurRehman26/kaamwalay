<?php

namespace App\Services\Admin\Report\MarketingReport;

/**
 * On request of Alex Kegan (Marketing)
 */
class MarketingQuarterlyReport extends MarketingReport
{
    public function shouldSendNow(): bool
    {
        return now()->firstOfQuarter()->isCurrentDay();
    }

    public function getReportTitle(): string
    {
        return "Marketing Report (Quarterly)";
    }

    public function getReportData(): array
    {
        return $this->getDataForReport(now()->subMonth()->startOfQuarter(), now()->subMonth()->endOfQuarter());
    }
}
