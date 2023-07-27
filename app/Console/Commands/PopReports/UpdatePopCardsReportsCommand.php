<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardProduct;
use App\Services\Card\Validators\CardProductsIdsExistValidator;
use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;

class UpdatePopCardsReportsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pop-reports:update-cards-report-array {ids*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Card Products Reports';

    public function handle(PopReportService $popReportService): int
    {
        $cardsIds = $this->argument('ids');

        CardProductsIdsExistValidator::validate($cardsIds);

        foreach ($cardsIds as $id) {
            $this->info('Updating values for card product: '.$id);
            $this->updatePopReports($popReportService, CardProduct::find($id));
        }

        return 0;
    }

    protected function updatePopReports(PopReportService $popReportService, CardProduct $cardProduct): void
    {
        $popReportService->updateCardProductsReport($cardProduct);
        $popReportService->updateSetsReport($cardProduct->cardSet);
        $popReportService->updateSeriesReport($cardProduct->cardSet->cardSeries);
    }
}
