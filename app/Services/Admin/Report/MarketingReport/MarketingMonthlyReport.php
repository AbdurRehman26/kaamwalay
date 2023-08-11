<?php

namespace App\Services\Admin\Report\MarketingReport;

/**
 * On request of Alex Kegan (Marketing)
 */
class MarketingMonthlyReport extends MarketingReport
{
    public function shouldSendNow(): bool
    {
        return now()->firstOfMonth()->isCurrentDay();
    }

    public function getReportTitle(): string
    {
        return 'Marketing Report (Monthly)';
    }

    public function getReportData(): array
    {
        return $this->getDataForReport(now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth(), now()->subMonths(2)->startOfMonth(), now()->subMonths(2)->endOfMonth());
    }
}
