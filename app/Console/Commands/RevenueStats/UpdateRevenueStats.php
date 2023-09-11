<?php

namespace App\Console\Commands\RevenueStats;

use App\Notifications\RevenueStatsUpdated;
use App\Services\Order\RevenueStatsService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
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
        $startDateTime = Carbon::parse($this->argument('startDateTime'));
        $endDateTime = Carbon::parse($this->argument('endDateTime'));

        $this->log('Revenue Stats Daily for Date : '.$startDateTime->format('Y-m-d').' Starting');

        $revenueStats = $revenueStatsService->addDailyStats($startDateTime, $endDateTime);
        $paidDailyCardsTotal = $revenueStatsService->calculateDailyCardsTotal($startDateTime, $endDateTime);

        $this->log('Revenue Stats Daily for Month : '.Carbon::parse($startDateTime)->format('F-Y').' Starting');

        $revenueStatsMonthly = $revenueStatsService->addMonthlyStats($startDateTime);
        $paidMonthlyCardsTotal = $revenueStatsService->calculateMonthlyCardsTotal($startDateTime);

        if (! app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new RevenueStatsUpdated($revenueStats, $revenueStatsMonthly, $paidDailyCardsTotal, $paidMonthlyCardsTotal));
        }

        $this->log('Revenue Stats Daily for Date : '.$startDateTime->format('Y-m-d').' Completed');
        $this->log('Revenue Stats Daily for Month : '.Carbon::parse($startDateTime)->format('F-Y').' Completed');

        return 0;
    }

    protected function log(string $message, array $context = []): void
    {
        $this->info($message);
        Log::info($message, $context);
    }
}
