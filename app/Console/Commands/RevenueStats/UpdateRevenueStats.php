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
    protected $signature = 'revenue-stats:calculate-for-day {startDateTime : YYYY-MM-DD H:m:s format} {endDateTime : YYYY-MM-DD H:m:s format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Revenue and Profit Stats Daily at 12:05 am';

    /**
     * Execute the console command.
     */
    public function handle(RevenueStatsService $revenueStatsService): int
    {
        $starDateTime = Carbon::parse($this->argument('startDateTime'));
        $endDateTime = Carbon::parse($this->argument('endDateTime'));

        $this->log('Revenue Stats Daily for Date : '.$starDateTime->format('Y-m-d').' Starting');

        $revenueStats = $revenueStatsService->addDailyStats($starDateTime, $endDateTime);
        $paidDailyCardsTotal = $revenueStatsService->calculateDailyCardsTotal($starDateTime, $endDateTime);

        $this->log('Revenue Stats Daily for Month : '.Carbon::parse($starDateTime)->format('F-Y').' Starting');

        $revenueStatsMonthly = $revenueStatsService->addMonthlyStats($starDateTime);
        $paidMonthlyCardsTotal = $revenueStatsService->calculateMonthlyCardsTotal($starDateTime);

        if (! app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new RevenueStatsUpdated($revenueStats, $revenueStatsMonthly, $paidDailyCardsTotal, $paidMonthlyCardsTotal));
        }

        $this->log('Revenue Stats Daily for Date : '.$starDateTime->format('Y-m-d').' Completed');
        $this->log('Revenue Stats Daily for Month : '.Carbon::parse($starDateTime)->format('F-Y').' Completed');

        return 0;
    }

    protected function log(string $message, array $context = []): void
    {
        $this->info($message);
        Log::info($message, $context);
    }
}
