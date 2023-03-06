<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardProduct;
use App\Services\PopReport\PopReportService;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

class UpdateCardReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pop-reports:update-cards-report {--only-missing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Card Products Reports';

    public function handle(PopReportService $popReportService): int
    {
        $onlyMissing = $this->option('only-missing');

        if ($onlyMissing) {
            $cards = $this->searchCardsWithMissingPopReports($popReportService);

            foreach ($cards as $card) {
                $this->info("Updating values for card product: ". $card->id);
                $this->updatePopReports($popReportService, $card);
            }
        } else {
            $popReportService->updateAllCardProductsReport();
        }

        return 0;
    }

    protected function updatePopReports(PopReportService $popReportService, CardProduct $cardProduct): void
    {
        $popReportService->updateCardProductsReport($cardProduct);
        $popReportService->updateSetsReport($cardProduct->cardSet);
        $popReportService->updateSeriesReport($cardProduct->cardSet->cardSeries);
    }

    /**
     * @param  PopReportService  $popReportService
     * @return Collection<int, CardProduct>
     */
    protected function searchCardsWithMissingPopReports(PopReportService $popReportService): Collection
    {
        return $popReportService->searchCardsWithMissingPopReports();
    }
}
