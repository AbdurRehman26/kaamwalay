<?php

namespace App\Console\Commands\Salesman;

use App\Models\Order;
use App\Notifications\Salesman\TopSalesmenStatsNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SendTopSalesmenStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'salesman:send-top-salesmen-stats {date? : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send top salesmen stats daily at 12:20 am';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $endDate = (Carbon::parse($this->argument('date')))->endOfDay()->format('Y-m-d');
        $topSalesmenStats = ['date' => $endDate, 'data' => $this->getData(Carbon::parse($endDate)->startOfMonth()->format('Y-m-d'), $endDate)];

        $this->info('Top Salesmen Stats for Month : ' . Carbon::parse($endDate)->format('F-Y') . ' Starting');

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new TopSalesmenStatsNotification($topSalesmenStats));

        $this->info('Top Salesmen Stats for Month : ' . Carbon::parse($endDate)->format('F-Y') . ' Completed');

        return 0;
    }

    /**
     * @param  string  $startDate
     * @param  string  $endDate
     * @return Collection<int,Order>
     */
    protected function getData(string $startDate, string $endDate): Collection
    {
        return Order::join('users', 'users.id', 'orders.salesman_id')
            ->whereNotNull('orders.salesman_id')
            ->select(DB::raw('CONCAT(users.first_name, " ", users.last_name) as full_name'), DB::raw('sum(orders.grand_total) as total'))
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('orders.salesman_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();
    }
}
