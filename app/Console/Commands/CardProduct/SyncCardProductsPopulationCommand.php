<?php

namespace App\Console\Commands\CardProduct;

use Illuminate\Console\Command;
use DB;

class SyncCardProductsPopulationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'card-product:sync-population';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all CardProduct items population column with related PopReportsCard.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        DB::table('card_products')
            ->join('pop_reports_cards', 'card_products.id', '=', 'pop_reports_cards.card_product_id')
            ->update(['card_products.population' => DB::raw('pop_reports_cards.population')]);

        $this->info('Sync Done');

        return Command::SUCCESS;
    }
}
