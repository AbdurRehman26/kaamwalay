<?php

namespace App\Console\Commands\Salesman;

use App\Models\Order;
use App\Notifications\Salesman\SalesmenStatsNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class SendSalesmenStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'salesman:send-salesmen-stats {date? : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send salesmen stats daily at 12:05 am';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $endDate = (Carbon::parse($this->argument('date')))->endOfDay()->format('Y-m-d');
        $salesmenStats = ['date' => $endDate, 'data' => $this->getData(Carbon::parse($endDate)->startOfMonth()->format('Y-m-d'), $endDate)];

        $this->info('Salesmen Stats for Month : '.Carbon::parse($endDate)->format('F-Y').' Starting');

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new SalesmenStatsNotification($salesmenStats));

        $this->info('Salesmen Stats for Month : '.Carbon::parse($endDate)->format('F-Y').' Completed');

        return 0;
    }

    /**
     * @return Collection<int,Order>
     */
    protected function getData(string $startDate, string $endDate): Collection
    {
        return Order::paid()
            ->join('users', 'users.id', 'orders.salesman_id')
            ->whereNotNull('orders.salesman_id')
            ->select(DB::raw('CONCAT(users.first_name, " ", users.last_name) as full_name'), DB::raw('COUNT(*) as number_of_orders'), DB::raw('SUM(orders.grand_total) as total'))
            ->whereBetween(DB::raw("CONVERT_TZ(orders.paid_at, 'UTC', 'America/New_York')"), [$startDate, $endDate])
            ->groupBy('orders.salesman_id')
            ->orderByDesc('total')
            ->get();
    }
}
