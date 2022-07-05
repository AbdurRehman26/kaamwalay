<?php

namespace App\Services\Report;

use App\Exceptions\Services\Admin\ServiceNotReportableException;
use App\Mail\Admin\Report;
use App\Models\User;
use App\Services\Report\Contracts\Reportable;
use App\Services\Report\Contracts\ReportableMonthly;
use App\Services\Report\Contracts\ReportableWeekly;
use App\Services\Report\Contracts\ReportableYearly;
use App\Services\Report\Traits\HasIntervalDates;
use Illuminate\Support\Facades\Mail;

class ReportsService
{
    use HasIntervalDates;

    protected array $mailableReports = [
        StatsReportService::class,
    ];

    /**
     * @throws ServiceNotReportableException
     */
    public function send(): void
    {
        foreach ($this->mailableReports as $mailableReport) {
            $report = resolve($mailableReport);

            if (! $report instanceof Reportable) {
                throw new ServiceNotReportableException();
            }

            if ($report instanceof  ReportableWeekly && $report->isEligibleToBeSentWeekly()) {
                $this->sendMail($report, 'weekly');
            }

            if ($report instanceof  ReportableMonthly && $report->isEligibleToBeSentMonthly()) {
                $this->sendMail($report, 'monthly');
            }

            if ($report instanceof  ReportableYearly && $report->isEligibleToBeSentYearly()) {
                $this->sendMail($report, 'yearly');
            }
        }
    }

    protected function sendMail(Reportable $report, $interval = 'weekly'): void
    {
        Mail::to(User::whereIn('email', config('mail.admin_addresses'))->get())->send(
            new Report(
                reportData: $report->getReportData(
                    $this->getFromDate($interval),
                    $this->getToDate($interval)
                ),
                templateInfo: [
                    'name' => $report->getTemplate(),
                    'heading' => $report->getReportTitle($interval),
                ]
            )
        );
    }
}
