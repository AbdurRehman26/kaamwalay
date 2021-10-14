<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardProduct;
use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;

class UpdatePopCardProductsReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports-update:card-products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Card Products Reports';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PopReportService $popReportService)
    {
        $cardProductIds = CardProduct::all()->pluck('id');
        foreach ($cardProductIds as $cardProductId) {
            $popReportService->updateCardProductsReport($cardProductId);
        }

        return 0;
    }
}
