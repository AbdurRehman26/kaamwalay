<?php

namespace App\Mail\Admin\StatsReport;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StatsReport extends Mailable
{
    use SerializesModels;

    public array $statsReport;
    public string $reportType;

    public function __construct(array $statsReport, string $reportType)
    {
        $this->reportType = $reportType;
        $this->statsReport = $statsReport;
    }

    public function build(): StatsReport
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.admin.stats-report')
            ->with([
                'report' => $this->statsReport,
                'title' => $this->reportType
            ]);
    }
}
