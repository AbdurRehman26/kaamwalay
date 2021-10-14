<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\PopCardsReport;
use App\Models\PopSeriesReport;
use App\Models\PopSetsReport;
use Illuminate\Console\Command;

class InitializePopReportsForAll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports-update:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize Pop Reports For Series, Sets and Cards.';
    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $selectOption = $this->ask('Initialize Report Values for 1.All 2.Series 3.Sets 4.Cards');

        /* For Series */
        if ($selectOption == 1 || $selectOption == 2) {
            $this->info("Initializing Values for Series");

            $cardSeriesIds = CardSeries::all()->pluck('id');

            foreach ($cardSeriesIds as $cardSeriesId) {
                PopSeriesReport::firstOrCreate([ 'card_series_id' => $cardSeriesId ]);
            }

            $this->info("Initializing Values for Series Completed");
        }

        /* For Sets */

        if ($selectOption == 1 || $selectOption == 3) {
            $this->info("Initializing Values for Sets");

            $cardSets = CardSet::all();

            foreach ($cardSets as $cardSet) {
                PopSetsReport::firstOrCreate([
                    'card_set_id' => $cardSet->id, 'card_series_id' => $cardSet->card_series_id,
                ]);
            }

            $this->info("Initializing Values for Sets Completed");
        }


        /* For Cards */

        if ($selectOption == 1 || $selectOption == 4) {
            $this->info("Initializing Values for Cards");

            $cardProducts = CardProduct::all();

            foreach ($cardProducts as $cardProduct) {
                PopCardsReport::firstOrCreate([
                    'card_product_id' => $cardProduct->id, 'card_set_id' => $cardProduct->card_set_id,
                ]);
            }

            $this->info("Initializing Values for Cards Completed");
        }

        return 0;
    }
}
