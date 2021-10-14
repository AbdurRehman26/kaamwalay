<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardSeries;
use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;

class UpdatePopSeriesReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports-update:series';

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
        $cardSeriesIds = CardSeries::all()->pluck('id');

        foreach ($cardSeriesIds as $cardSeriesId) {
            $popReportService->updateSeriesReport($cardSeriesId);
        }
        
        return 0;
    }
}
