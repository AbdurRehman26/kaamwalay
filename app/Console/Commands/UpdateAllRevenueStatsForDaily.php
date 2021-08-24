<?php

namespace App\Console\Commands;

use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
use App\Services\Order\RevenueStatsService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateAllRevenueStatsForDaily extends Command
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

    public function handle(): int
    {
        Log::info("Revenue Stats For Previously Missed Dates");

        $lastRevenueDate = Carbon::now()->toDateString();

        $revenueDaily = RevenueStatsDaily::first();

        if (! empty($revenueDaily)) {
            $lastRevenueDate = $revenueDaily->event_at;
        }

        OrderPayment::whereDate('created_at', '<', $lastRevenueDate)->select('created_at')->distinct()->get()->pluck('created_at')->map(function ($date) {
            Log::info("Revenue Stats for Date : ".$date->toDateString(). " Adding.");

            $revenueStatsService = new RevenueStatsService($date->toDateString());
            $revenueStatsService->addStats();

            Log::info("Revenue Stats for Date : ".$date->toDateString(). " Added.");
        });

        Log::info("Revenue Stats Daily For Previously Missed Dates Completed.");


        return 0;
    }
}
