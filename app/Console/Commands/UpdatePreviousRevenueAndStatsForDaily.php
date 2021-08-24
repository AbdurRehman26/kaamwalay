<?php

namespace App\Console\Commands;

use App\Models\OrderPayment;
use Illuminate\Console\Command;

class UpdatePreviousRevenueAndStatsForDaily extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revenue-stats-all:daily';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Revenue and Profit Stats That Were Previously Missed';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $orderPayment = OrderPayment::first();

        return 0;
    }
}
