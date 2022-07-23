<?php

namespace App\Console\Commands;

use App\Exceptions\Services\Admin\ReportIsNotReportableException;
use App\Services\Admin\Report\ReportsService;
use Illuminate\Console\Command;

class SendAdminReports extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin-reports:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reports to admins. Reports for marketing, OPS, etc.';

    /**
     * @throws ReportIsNotReportableException
     */
    public function handle(ReportsService $reportsService): int
    {
        $reportsService->send();

        return 0;
    }
}
