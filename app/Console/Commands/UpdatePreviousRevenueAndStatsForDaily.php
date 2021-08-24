<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use Carbon\Carbon;
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
        $lastRevenueDate = Carbon::now()->toDateString();
        $revenueDaily = RevenueStatsDaily::first();

        if (! empty($revenueDaily)) {
            $lastRevenueDate = $revenueDaily->event_at;
        }

        $items = OrderPayment::select('created_at')->distinct()->get()->pluck('created_at');
        dd($items);
        dd(OrderPayment::all()->unique('created_at'));

//        dd($orderPayment);

        return 0;
    }
}
