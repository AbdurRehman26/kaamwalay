<?php

namespace App\Console\Commands\StatsReport;

use App\Services\Report\ReportsService;
use Illuminate\Console\Command;

class SendReportsEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports:send-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send emails to admins of reports';

    public function handle(): int
    {
        resolve(ReportsService::class)->send();
        return 0;
    }
}
