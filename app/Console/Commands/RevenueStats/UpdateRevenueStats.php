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
        $currentDate = (
            Carbon::parse($this->argument('date')) ?? Carbon::now()->subDays(1)
        )->format('Y-m-d');

        $this->log('Revenue Stats Daily for Date : ' . $currentDate . ' Starting');

        $revenueStats = $revenueStatsService->addDailyStats($currentDate);

        $this->log('Revenue Stats Daily for Month : ' . Carbon::parse($currentDate)->format('F-Y') . ' Starting');

        $revenueStatsMonthly = $revenueStatsService->addMonthlyStats($currentDate);

        if (! app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new RevenueStatsUpdated($revenueStats, $revenueStatsMonthly));
        }

        $this->log('Revenue Stats Daily for Date : ' . $currentDate . ' Completed');
        $this->log('Revenue Stats Daily for Month : ' . Carbon::parse($currentDate)->format('F-Y') . ' Completed');

        return 0;
    }

    protected function log(string $message, array $context = []): void
    {
        $this->info($message);
        Log::info($message, $context);
    }
}
