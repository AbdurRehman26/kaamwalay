<?php

namespace App\Console\Commands\PopReports;

use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;

class UpdateSeriesReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pop-reports:update-series-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Series Reports';

    public function handle(PopReportService $popReportService): int
    {
        $popReportService->updateAllSeriesReport();

        return 0;
    }
}
