<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardSeries;
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
    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PopReportService $popReportService)
    {
        $allCardSeries = CardSeries::all();

        foreach ($allCardSeries as $cardSeries) {
            $this->info('Updating reports for card series ' . $cardSeries->id);

            $popReportService->updateSeriesReport($cardSeries);

            $this->info('Updating reports for card series ' . $cardSeries->id . ' completed');
        }
        
        return 0;
    }
}
