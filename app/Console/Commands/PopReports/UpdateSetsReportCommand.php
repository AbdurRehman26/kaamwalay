<?php

namespace App\Console\Commands\PopReports;

use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;

class UpdateSetsReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pop-reports:update-sets-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Card Sets Reports';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PopReportService $popReportService)
    {
        $popReportService->updateAllSetsReport();

        return 0;
    }
}
