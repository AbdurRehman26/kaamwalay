<?php

namespace App\Console\Commands;

use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateRevenueStatsDaily extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revenue-stats:daily {date : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Revenue and Profit Stats Daily at 12:20 am';

    /**
     * The console command option.
     *
     * @var string
     */
    protected $currentDate = 'Current date attribute which will be set to yesterday by default';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->currentDate = $this->option('date') ?? Carbon::now()->subDays(1)->toDateString();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $currentDate = $this->currentDate;

        Log::info("Revenue Stats Daily for Date : ".$currentDate);

        /*Using order payments instead of orders
        because we might take payments of some orders
        not on the same day*/

        $orderPayments = OrderPayment::whereDate('created_at', $currentDate)->get();

        $revenueData = [
          'profit' => 0,
          'revenue' => 0,
          'event_at' => $currentDate
        ];

        $orderPayments->map(function($orderPayment) use ($revenueData){
            $revenueData['profit'] += $orderPayment->order->grand_total;
            $revenueData['revenue'] += $orderPayment->order->grand_total;
        });


        $dailyRevenue = RevenueStatsDaily::firstOrCreate('event_at', $currentDate);

        if($dailyRevenue['profit'] != $revenueData['profit'] || $dailyRevenue['revenue'] != $revenueData['revenue']){
          Log::info("Discrepancy found in the revenue stats");
          Log::info("Revenue stats in database -> Profit: ".$dailyRevenue['profit']. ", Revenue: ". $dailyRevenue['revenue']);
          Log::info("Revenue stats in calculated from Orders -> Profit: ".$revenueData['profit']. ", Revenue: ". $revenueData['revenue']);

          Log::info("Updating Revenue Stats");

        }

        $dailyRevenue->save();

        Log::info("Revenue Stats Daily for Date : ".$currentDate. " Completed");

        return 0;
    }
}
