<?php

namespace App\Services\Admin\Report;

use App\Contracts\Services\Admin\Reportable;
use App\Exceptions\Services\Admin\ReportIsNotReportableException;
use App\Mail\Admin\ReportMail;
use App\Models\User;
use App\Services\Admin\Report\MarketingReport\MarketingMonthlyReport;
use App\Services\Admin\Report\MarketingReport\MarketingQuarterlyReport;
use App\Services\Admin\Report\MarketingReport\MarketingWeeklyReport;
use App\Services\Admin\Report\MarketingReport\MarketingYearlyReport;
use Illuminate\Support\Facades\Mail;

class ReportsService
{
    protected array $reports = [
        MarketingWeeklyReport::class,
        MarketingMonthlyReport::class,
        MarketingQuarterlyReport::class,
        MarketingYearlyReport::class
    ];

    /**
     * @throws ReportIsNotReportableException
     */
    public function send(): void
    {
        foreach ($this->reports as $reportClass) {
            $report = new $reportClass;

            if (! $report instanceof Reportable) {
                throw new ReportIsNotReportableException();
            }

            if ($report->shouldSendNow()) {
                $this->sendMail($report);
            }
        }
    }

    protected function sendMail(Reportable $report): void
    {
        Mail::to(User::admin()->get())->send(
            new ReportMail(
                reportData: $report->getReportData(),
                templateInfo: [
                    'name' => $report->getTemplate(),
                    'heading' => $report->getReportTitle(),
                ]
            )
        );
    }
}
