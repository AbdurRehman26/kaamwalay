<?php

namespace App\Console\Commands\PopReports;

use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;

class UpdateCardReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pop-reports:update-cards-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Card Products Reports';

    public function handle(PopReportService $popReportService): int
    {
        $popReportService->updateAllCardProductsReport();

        return 0;
    }
}
