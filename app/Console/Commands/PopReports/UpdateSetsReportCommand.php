<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardSet;
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
        $cardSets = CardSet::join('card_products', 'card_products.card_set_id', '=', 'card_sets.id')
            ->join('order_items', 'order_items.card_product_id', '=', 'card_products.id')
            ->join('user_cards', 'user_cards.order_item_id', '=', 'order_items.id')
            ->groupBy('card_sets.id')
            ->select('card_sets.*')
            ->get();

        $this->info('Total sets to be processed: ' . count($cardSets));

        foreach ($cardSets as $cardSet) {
            $this->info('Updating reports for card sets ' . $cardSet->id);

            $popReportService->updateSetsReport($cardSet);

            $this->info('Updating reports for card sets ' . $cardSet->id . ' completed');
        }

        return 0;
    }
}
