<?php

namespace App\Console\Commands\RevenueStats;

use App\Notifications\UnpaidOrdersStats;
use App\Services\Order\UnpaidOrdersStatsService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendUnpaidOrdersStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unpaid-orders-stats:calculate-for-day {startDateTime : YYYY-MM-DD H:m:s format} {endDateTime : YYYY-MM-DD H:m:s format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send unpaid orders stats daily at 12:05 am';

    /**
     * Execute the console command.
     */
    public function handle(UnpaidOrdersStatsService $unpaidOrdersStatsService): int
    {
        $startDateTime = Carbon::parse($this->argument('startDateTime'));
        $endDateTime = Carbon::parse($this->argument('endDateTime'));

        $this->log('Unpaid Stats Daily for Date : '.$startDateTime->format('Y-m-d').' Starting');

        $unpaidDailyStats = $unpaidOrdersStatsService->calculateDailyStats($startDateTime, $endDateTime);
        $unpaidDailyCardsTotal = $unpaidOrdersStatsService->calculateDailyCardsTotal($startDateTime, $endDateTime);

        $this->log('Unpaid Stats Daily for Month : '.Carbon::parse($startDateTime)->format('F-Y').' Starting');

        $unpaidMonthlyStats = $unpaidOrdersStatsService->calculateMonthlyStats($startDateTime);
        $unpaidMonthlyCardsTotal = $unpaidOrdersStatsService->calculateMonthlyCardsTotal($startDateTime);

        if (! app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new UnpaidOrdersStats($unpaidDailyStats, $unpaidMonthlyStats, $unpaidDailyCardsTotal, $unpaidMonthlyCardsTotal));
        }

        $this->log('Unpaid Stats Daily for Date : '.$startDateTime->format('Y-m-d').' Completed');
        $this->log('Unpaid Stats Daily for Month : '.Carbon::parse($startDateTime)->format('F-Y').' Completed');

        return 0;
    }

    protected function log(string $message, array $context = []): void
    {
        $this->info($message);
        Log::info($message, $context);
    }
}
