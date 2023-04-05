<?php

namespace App\Console\Commands\RevenueStats;

use App\Models\OrderPayment;
use App\Models\RevenueStatsDaily;
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
    protected $signature = 'revenue-stats:calculate-for-missing-days';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Revenue and Profit Stats That Were Previously Missed';

    public function handle(): int
    {
        $this->info("Revenue Stats For Previously Missed Dates Starting...");
        Log::info("Revenue Stats For Previously Missed Dates Starting...");

        $lastRevenueDate = Carbon::now()->toDateString();

        $revenueDaily = RevenueStatsDaily::orderBy('event_at', 'asc')->first();

        if (! empty($revenueDaily)) {
            $lastRevenueDate = $revenueDaily->event_at;
        }
        OrderPayment::whereDate('created_at', '<', $lastRevenueDate)
            ->distinct()
            ->pluck('created_at')
            ->each(function (Carbon $date) {
                $formattedDate = $date->toDateString();
                Log::info("Revenue Stats for Date : " . $formattedDate . " Adding.");

                //                $revenueStatsService->addStats($formattedDate);

                Log::info("Revenue Stats for Date : " . $formattedDate . " Added.");
                $this->info("Revenue Stats for Date : " . $formattedDate . " Added.");
            });

        $this->info("Revenue Stats Daily For Previously Missed Dates Completed.");
        Log::info("Revenue Stats Daily For Previously Missed Dates Completed.");

        return 0;
    }
}
