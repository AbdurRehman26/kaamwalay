<?php

namespace App\Console\Commands\RevenueStats;

use App\Notifications\UnpaidOrdersStatsUpdated;
use App\Services\Order\UnpaidStatsService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class UpdateUnpaidStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unpaid-stats:calculate-for-day {date? : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Unpaid Orders Stats Daily at 12:20 am';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(UnpaidStatsService $unpaidOrdersStatsService): int
    {
        $currentDate = (Carbon::parse($this->argument('date')))->format('Y-m-d');

        $this->log('Unpaid Stats Daily for Date : ' . $currentDate . ' Starting');

        $unpaidDailyStats = $unpaidOrdersStatsService->addDailyUnpaidStats($currentDate);

        $this->log('Unpaid Stats Daily for Month : ' . Carbon::parse($currentDate)->format('F-Y') . ' Starting');

        $unpaidMonthlyStats = $unpaidOrdersStatsService->addMonthlyUnpaidStats($currentDate);

        if (! app()->environment('local')) {
            Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
                ->notify(new UnpaidOrdersStatsUpdated($unpaidDailyStats, $unpaidMonthlyStats));
        }

        $this->log('Unpaid Stats Daily for Date : ' . $currentDate . ' Completed');
        $this->log('Unpaid Stats Daily for Month : ' . Carbon::parse($currentDate)->format('F-Y') . ' Completed');

        return 0;
    }

    protected function log(string $message, array $context = []): void
    {
        $this->info($message);
        Log::info($message, $context);
    }
}
