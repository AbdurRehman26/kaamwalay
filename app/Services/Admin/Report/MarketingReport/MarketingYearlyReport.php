<?php

namespace App\Services\Admin\Report\MarketingReport;

/**
 * On request of Alex Kegan (Marketing)
 */
class MarketingYearlyReport extends MarketingReport
{
    public function shouldSendNow(): bool
    {
        return now()->firstOfYear()->isCurrentDay();
    }

    public function getReportTitle(): string
    {
        return 'Marketing Report (Yearly)';
    }

    public function getReportData(): array
    {
        return $this->getDataForReport(now()->subYear()->firstOfYear()->startOfDay(), now()->subYear()->lastOfYear()->endOfDay());
    }
}
