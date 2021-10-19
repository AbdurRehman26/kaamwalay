<?php

namespace App\Console\Commands\PopReports;

use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\PopReportsCard;
use App\Models\PopReportsSeries;
use App\Models\PopReportsSet;
use Illuminate\Console\Command;

class InitializePopReports extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pop-reports:initialize';

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
    public function handle(): int
    {
        $selectedOption = $this->choice(
            'Initialize Report Values for :',
            ['All', 'Series', 'Sets', 'Cards'],
            '0'
        );

        /* For Series */
        if ($selectedOption == "All" || $selectedOption == "Series") {
            $this->info("Initializing Values for Series");

            $cardSeriesIds = CardSeries::pluck('id');

            foreach ($cardSeriesIds as $cardSeriesId) {
                PopReportsSeries::firstOrCreate([ 'card_series_id' => $cardSeriesId ]);
            }

            $this->info("Initializing Values for Series Completed");
        }

        /* For Sets */

        if ($selectedOption == "All" || $selectedOption == "Sets") {
            $this->info("Initializing Values for Sets");

            $cardSets = CardSet::all();

            foreach ($cardSets as $cardSet) {
                PopReportsSet::firstOrCreate([
                    'card_set_id' => $cardSet->id, 'card_series_id' => $cardSet->card_series_id,
                ]);
            }

            $this->info("Initializing Values for Sets Completed");
        }


        /* For Cards */

        if ($selectedOption == "All" || $selectedOption == "Cards") {
            $this->info("Initializing Values for Cards");

            $cardProducts = CardProduct::all();

            foreach ($cardProducts as $cardProduct) {
                PopReportsCard::firstOrCreate([
                    'card_product_id' => $cardProduct->id, 'card_set_id' => $cardProduct->card_set_id,
                ]);
            }

            $this->info("Initializing Values for Cards Completed");
        }

        return 0;
    }
}
