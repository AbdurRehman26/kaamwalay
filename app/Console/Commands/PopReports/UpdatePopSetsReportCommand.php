<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardSet;
use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;

class UpdatePopSetsReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports-update:sets';

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
        $cardSetIds = CardSet::all()->pluck('id');
        foreach ($cardSetIds as $cardSetId) {
            $popReportService->updateSetsReport($cardSetId);
        }

        return 0;
    }
}
