<?php

namespace App\Console\Commands\PopReports;

use App\Services\PopReport\PopReportService;
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
    public function handle(PopReportService $popReportService): int
    {
        $selectedOption = 'Cards';
//        $this->choice(
//            'Initialize Report Values for :',
//            ['All', 'Series', 'Sets', 'Cards'],
//            '0'
//        );

        $popReportService->updatePopReportsForOrder(\App\Models\Order::find(1));
        dd(1);
        if ($selectedOption === "All") {
            $popReportService->initializePopReportsForAll();
        }

        /* For Series */
        if ($selectedOption === "Series") {
            $this->info("Initializing Values for Series");

            $popReportService->initializePopReportsForCardSeries();

            $this->info("Initializing Values for Series Completed");
        }

        /* For Sets */

        if ($selectedOption === "Sets") {
            $this->info("Initializing Values for Sets");

            $popReportService->initializePopReportsForCardSets();

            $this->info("Initializing Values for Sets Completed");
        }


        /* For Cards */

        if ($selectedOption === "Cards") {
            $this->info("Initializing Values for Cards");

            $popReportService->initializePopReportsForCards();

            $this->info("Initializing Values for Cards Completed");
        }

        return 0;
    }
}
