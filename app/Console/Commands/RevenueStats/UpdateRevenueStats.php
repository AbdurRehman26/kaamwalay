<?php

namespace App\Console\Commands\RevenueStats;

use App\Notifications\RevenueStatsUpdated;
use App\Services\Order\RevenueStatsService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class UpdateRevenueStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revenue-stats:calculate-for-day {date? : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Revenue and Profit Stats Daily at 12:20 am';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(RevenueStatsService $revenueStatsService): int
    {
        $currentDate = Carbon::parse($this->argument('date')) ?? Carbon::now()->subDays(1);
        $formattedDate = $currentDate->format('Y-m-d');

        $this->info("Revenue Stats Daily for Date : " . $formattedDate . " Starting");
        Log::info("Revenue Stats Daily for Date : " . $formattedDate . " Starting");
        $revenueStats = $revenueStatsService->addDailyStats($formattedDate);
        $this->info("Revenue Stats Daily for Month : " . date('F-Y', strtotime($formattedDate)) . " Starting");
        Log::info("Revenue Stats Daily for Month : " . date('F-Y', strtotime($formattedDate)) . " Starting");
        $revenueStatsMonthly = $revenueStatsService->addMonthlyStats($formattedDate);

        if (! app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new RevenueStatsUpdated($revenueStats, $revenueStatsMonthly));
        }

        $this->info("Revenue Stats Daily for Date : " . $formattedDate . " Completed");
        Log::info("Revenue Stats Daily for Date : " . $formattedDate . " Completed");
        $this->info("Revenue Stats Daily for Month : " . date('F-Y', strtotime($formattedDate)) . " Completed");
        Log::info("Revenue Stats Daily for Month : " . date('F-Y', strtotime($formattedDate)) . " Completed");

        return 0;
    }
}
