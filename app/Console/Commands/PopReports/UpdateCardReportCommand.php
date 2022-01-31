<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardProduct;
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

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PopReportService $popReportService): int
    {
        $cardProducts = CardProduct::join('order_items', 'order_items.card_product_id', '=', 'card_products.id')
            ->join('user_cards', 'user_cards.order_item_id', '=', 'order_items.id')
            ->groupBy('card_products.id')
            ->select('card_products.*')
            ->get();

        $this->info('Total cards to be processed: ' . count($cardProducts) );

        $popReportService->updateMultipleCardProductsReports($cardProducts);

        return 0;
    }
}
